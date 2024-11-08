// app/api/auth/google/route.ts
import { generateCodeVerifier, generateCodeChallenge } from '@/lib/pkce';
import { cookies } from 'next/headers';

export async function GET() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Store code verifier in cookie
  cookies().set('code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });

  const searchParams = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
    response_type: 'code',
    scope: 'openid email profile',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    access_type: 'offline',
    prompt: 'consent'
  });

  return Response.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${searchParams.toString()}`
  );
}