// lib/auth-config.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";
import { createClientSession } from "./auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { client: true },
        });

        if (!existingUser) {
          // Create new user and client
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              username: user.email!.split("@")[0],
              password: "", // Empty password for OAuth users
              role: "CLIENT",
              client: {
                create: {
                  fullName: user.name || "New Client",
                }
              }
            },
            include: { client: true },
          });

          // Create client session
          await createClientSession({
            id: newUser.id,
            email: newUser.email,
            role: "CLIENT",
            clientId: newUser.client!.id,
            fullName: newUser.client!.fullName,
            permissions: ["client.access"],
          });

          return true;
        }

        // Create session for existing user
        if (existingUser.role === "CLIENT") {
          await createClientSession({
            id: existingUser.id,
            email: existingUser.email,
            role: "CLIENT",
            clientId: existingUser.client!.id,
            fullName: existingUser.client!.fullName,
            permissions: ["client.access"],
          });
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl + "/dashboard";
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};