// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      email: string;
      name?: string;
      username: string;
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: Role;
    username: string;
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    userId: string;
    username: string;
  }
}