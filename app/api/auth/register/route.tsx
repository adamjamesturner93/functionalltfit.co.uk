import { SignJWT } from 'jose';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

import { authorizeUser, generateRefreshToken, unauthorizedResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const { email, name, dateOfBirth, gender, unitPreference, height, weight, termsAgreed } =
    await request.json();

  if (
    !email ||
    !name ||
    !dateOfBirth ||
    !gender ||
    !unitPreference ||
    !height ||
    !weight ||
    termsAgreed === undefined
  ) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        email,
        name,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        height: parseFloat(height),
        preferences: {
          upsert: {
            create: { weightUnit: unitPreference, lengthUnit: unitPreference },
            update: { weightUnit: unitPreference, lengthUnit: unitPreference },
          },
        },
        Measurement: {
          create: { weight: parseFloat(weight), date: new Date() },
        },
        membershipStatus: 'ACTIVE',
        membershipPlan: 'FREE',
        isRegistrationComplete: true,
        termsAgreed,
      },
      include: {
        preferences: true,
        Measurement: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
    });

    // Generate new access token
    const accessToken = await new SignJWT({ userId: updatedUser.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setJti(nanoid())
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(process.env.AUTH_SECRET));

    // Generate new refresh token
    const refreshToken = await generateRefreshToken(updatedUser.id);

    return NextResponse.json({
      accessToken,
      refreshToken,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        unitPreference: updatedUser.preferences?.weightUnit,
        height: updatedUser.height,
        weight: updatedUser.Measurement[0]?.weight,
        membershipStatus: updatedUser.membershipStatus,
        membershipPlan: updatedUser.membershipPlan,
        role: updatedUser.role,
        isRegistrationComplete: updatedUser.isRegistrationComplete,
        termsAgreed: updatedUser.termsAgreed,
      },
    });
  } catch (error) {
    console.error('Error completing registration:', error);
    return NextResponse.json({ error: 'Error completing registration' }, { status: 500 });
  }
}
