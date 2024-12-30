import { SignJWT } from 'jose';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

import { generateRefreshToken, verifyRefreshToken } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  const { grant_type, refresh_token } = await request.json();

  if (grant_type !== 'refresh_token' || !refresh_token) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const userId = await verifyRefreshToken(refresh_token);

    if (!userId) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    // Generate new access token
    const accessToken = await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setJti(nanoid())
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(process.env.AUTH_SECRET));

    // Generate new refresh token
    const newRefreshToken = await generateRefreshToken(userId);

    return NextResponse.json({
      access_token: accessToken,
      refresh_token: newRefreshToken,
      expires_in: 3600,
      token_type: 'Bearer',
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json({ error: 'Error refreshing token' }, { status: 500 });
  }
}
