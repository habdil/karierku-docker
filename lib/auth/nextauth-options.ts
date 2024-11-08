// lib/auth/nextauth-options.ts
import type { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma";
import { createClientSession } from "@/lib/auth";

// Define types for user data
interface CreateUserData {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
}

// Define adapter with proper typing
const customAdapter = {
  ...PrismaAdapter(prisma),
  createUser: async (data: CreateUserData) => {
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
} as Adapter;

export const authOptions: NextAuthOptions = {
  adapter: customAdapter,
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
      },
      profile(profile: {
        email: string;
        email_verified: boolean;
        name: string;
        picture?: string;
        sub: string;
      }) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          role: "CLIENT" as const,
          username: profile.email.split('@')[0],
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ 
      user, 
      account, 
      profile 
    }: {
      user: any;
      account: any;
      profile?: any;
    }) {
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
    async jwt({ 
      token, 
      user 
    }: {
      token: any;
      user: any;
    }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    async session({ 
      session, 
      token 
    }: {
      session: any;
      token: any;
    }) {
      if (session.user) {
        session.user.role = token.role as "CLIENT";
        session.user.id = token.userId as string;
      }
      return session;
    },
    async redirect({ 
      url, 
      baseUrl 
    }: {
      url: string;
      baseUrl: string;
    }) {
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