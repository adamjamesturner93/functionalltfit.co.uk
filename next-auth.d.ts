import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
  }
  interface JWT {
    role: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      token: string;
    } & DefaultSession["user"];
  }
}
