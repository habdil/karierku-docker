import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { createClientSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

// Tandai route sebagai dinamis
export const dynamic = 'force-dynamic';

// Helper untuk URL redirect yang aman
const getRedirectUrl = (path: string) => {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return new URL(path, baseUrl).toString();
};

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      console.error('No authorization code present');
      return Response.redirect(getRedirectUrl('/login?error=NoCode'));
    }

    const codeVerifier = cookies().get('code_verifier')?.value;
    
    if (!codeVerifier) {
      console.error('No code verifier found');
      return Response.redirect(getRedirectUrl('/login?error=NoCodeVerifier'));
    }

    cookies().delete('code_verifier');

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: getRedirectUrl('/api/auth/callback/google'),
        grant_type: 'authorization_code',
        code_verifier: codeVerifier
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Failed to get access token');
      const error = await tokenResponse.text();
      console.error(error);
      return Response.redirect(getRedirectUrl('/login?error=TokenError'));
    }

    const tokens = await tokenResponse.json();

    const userInfoResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      console.error('Failed to get user info');
      return Response.redirect(getRedirectUrl('/login?error=UserInfoError'));
    }

    const googleUser: GoogleUserInfo = await userInfoResponse.json();

    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
      include: { client: true },
    });

    if (!user) {
      const username = googleUser.email.split('@')[0];
      
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          username,
          name: googleUser.name,
          password: null,
          role: "CLIENT",
          image: googleUser.picture,
          client: {
            create: {
              fullName: googleUser.name,
              interests: [],
              hobbies: []
            }
          }
        },
        include: { client: true }
      });
    }

    await createClientSession({
      id: user.id,
      email: user.email,
      role: "CLIENT",
      clientId: user.client!.id,
      fullName: user.client!.fullName,
      permissions: ["client.access"]
    });

    return Response.redirect(getRedirectUrl('/dashboard'));
  } catch (error) {
    console.error('Google callback error:', error);
    return Response.redirect(getRedirectUrl('/login?error=CallbackError'));
  }
}