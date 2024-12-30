import { SignJWT } from 'jose';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

import { generateRefreshToken } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const { userId, authCode } = await request.json();

  if (!userId || !authCode) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true,
        Measurement: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
    });

    if (
      !user ||
      user.authCode !== authCode ||
      (user.authCodeExpiry && user.authCodeExpiry < new Date())
    ) {
      console.error('Invalid or expired auth code');
      return NextResponse.json({ error: 'Invalid or expired auth code' }, { status: 400 });
    }

    // Clear the auth code
    await prisma.user.update({
      where: { id: userId },
      data: { authCode: null, authCodeExpiry: null },
    });

    // Generate access token
    const accessToken = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setJti(nanoid())
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(process.env.AUTH_SECRET));

    // Generate refresh token
    const refreshToken = await generateRefreshToken(user.id);

    return NextResponse.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        unitPreference: user.preferences?.weightUnit,
        height: user.height,
        weight: user.Measurement[0]?.weight,
        membershipStatus: user.membershipStatus,
        membershipPlan: user.membershipPlan,
        role: user.role,
        isRegistrationComplete: user.isRegistrationComplete,
        termsAgreed: user.termsAgreed,
      },
    });
  } catch (error) {
    console.error('Error verifying auth code:', error);
    return NextResponse.json({ error: 'Error verifying auth code' }, { status: 500 });
  }
}
