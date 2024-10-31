import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAuthCode, sendAuthCode } from "@/lib/auth";
import { User } from "next-auth";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const user: User | null = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      console.log("no user found");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const authCode = generateAuthCode();
    const authCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await prisma.user.update({
      where: { id: user.id },
      data: { authCode, authCodeExpiry },
    });

    await sendAuthCode(email, authCode);

    return NextResponse.json(
      { message: "Auth code sent. Check your email.", userId: user.id },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error sending auth code", error },
      { status: 500 }
    );
  }
}
