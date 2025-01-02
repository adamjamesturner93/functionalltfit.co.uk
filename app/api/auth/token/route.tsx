import { NextRequest, NextResponse } from 'next/server';

import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/lib/auth-utils';

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
    const accessToken = await generateAccessToken(userId);

    // Generate new refresh token
    const newRefreshToken = await generateRefreshToken(userId);

    return NextResponse.json({
      access_token: accessToken,
      refresh_token: newRefreshToken,
      expires_in: 900,
      token_type: 'Bearer',
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json({ error: 'Error refreshing token' }, { status: 500 });
  }
}
