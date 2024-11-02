import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import sgMail from "@sendgrid/mail";

export const { auth, signIn, signOut, handlers } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Passwordless",
      credentials: {
        email: { label: "Email", type: "email" },
        authCode: { label: "Authentication Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.authCode) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          return null;
        }

        const isValid = await verifyAuthCode(
          user.id,
          credentials.authCode as string
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
        session.user.token = token.token as string; // Add this line
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export function generateAuthCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendAuthCode(email: string, authCode: string) {
  const msg = {
    to: email,
    from: "noreply@thechronicyogini.com",
    subject: "Your Authentication Code",
    text: `Your authentication code is: ${authCode}`,
    html: `<strong className="text-muted">Your authentication code is: ${authCode}</strong>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function verifyAuthCode(
  userId: string,
  authCode: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.authCode || !user.authCodeExpiry) {
    return false;
  }

  if (user.authCode !== authCode || user.authCodeExpiry < new Date()) {
    return false;
  }

  // Clear the auth code after successful verification
  await prisma.user.update({
    where: { id: userId },
    data: { authCode: null, authCodeExpiry: null },
  });

  return true;
}
