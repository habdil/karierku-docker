// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { Adapter } from "next-auth/adapters";
import prisma from "@/lib/prisma";

interface CreateUserData {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
}

export const authOptions: NextAuthOptions = {
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (data: CreateUserData) => {
      const username = data.email?.split('@')[0] || 
                      data.name?.toLowerCase().replace(/\s+/g, '') || 
                      `user${Date.now()}`;
                      
      return prisma.user.create({
        data: {
          name: data.name,
          email: data.email!,
          image: data.image,
          emailVerified: data.emailVerified,
          username,
          role: "CLIENT",
          client: {
            create: {
              fullName: data.name || username,
              interests: [],
              hobbies: []
            }
          }
        },
      });
    }
  } as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        const username = profile.email.split('@')[0] || 
                        profile.name?.toLowerCase().replace(/\s+/g, '') || 
                        `user${Date.now()}`;
                        
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username,
          role: "CLIENT" as const,
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { client: true }
          });

          if (!existingUser) {
            // User will be created by the adapter
            return true;
          }

          // Update session data for existing user
          user.role = existingUser.role;
          user.id = existingUser.id;
          return true;
        }
        return false;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
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
      return baseUrl + "/dashboard";
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/login'
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };