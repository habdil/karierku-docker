// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import { createClientSession } from "@/lib/auth";
import { authOptions } from "@/lib/auth/nextauth-options";

// Move options to separate file to avoid route export issues
const options: NextAuthOptions = {
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (data: any) => {
      const username = data.email?.split('@')[0] || 
                      data.name?.toLowerCase().replace(/\s+/g, '') || 
                      `user${Date.now()}`;
      
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email!,
          image: data.image,
          emailVerified: data.emailVerified,
          username,
          role: "CLIENT",
          password: null,
          client: {
            create: {
              fullName: data.name || username,
              interests: [],
              hobbies: []
            }
          }
        },
        include: { client: true }
      });

      await createClientSession({
        id: user.id,
        email: user.email,
        role: "CLIENT",
        clientId: user.client!.id,
        fullName: user.client!.fullName,
        permissions: ["client.access"]
      });

      return user;
    }
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { client: true }
          });

          if (existingUser) {
            await createClientSession({
              id: existingUser.id,
              email: existingUser.email,
              role: "CLIENT",
              clientId: existingUser.client!.id,
              fullName: existingUser.client!.fullName,
              permissions: ["client.access"]
            });
          }
          return true;
        } catch (error) {
          console.error("SignIn error:", error);
          return false;
        }
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "CLIENT";
        session.user.id = token.userId as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl + "/dashboard-client";
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/login'
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  debug: process.env.NODE_ENV === "development",
};

// Create handler
const handler = NextAuth(authOptions);

// Export as route handlers
export { handler as GET, handler as POST };