import { NextRequest, NextResponse } from 'next/server';

import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const {
    name,
    dateOfBirth,
    gender,
    weightUnitPreference,
    lengthUnitPreference,
    height,
    weight,
    termsAgreed,
    isRegistrationComplete,
  } = await request.json();

  console.log(
    'user: ',
    JSON.stringify(
      {
        name,
        dateOfBirth,
        gender,
        weightUnitPreference,
        lengthUnitPreference,
        height,
        weight,
        termsAgreed,
        isRegistrationComplete,
      },
      null,
      4,
    ),
  );

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        height: height ? parseFloat(height) : undefined,
        preferences:
          weightUnitPreference | lengthUnitPreference
            ? {
                upsert: {
                  create: { weightUnit: weightUnitPreference, lengthUnit: lengthUnitPreference },
                  update: { weightUnit: weightUnitPreference, lengthUnit: lengthUnitPreference },
                },
              }
            : undefined,
        Measurement: weight
          ? {
              create: { weight: parseFloat(weight), date: new Date() },
            }
          : undefined,
        termsAgreed: termsAgreed !== undefined ? termsAgreed : undefined,
        membershipStatus: 'ACTIVE',
        membershipPlan: 'FREE',
        isRegistrationComplete,
      },
      include: {
        preferences: true,
        Measurement: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
    });

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        weightUnitPreference: updatedUser.preferences?.weightUnit,
        lengthUnitPreference: updatedUser.preferences?.lengthUnit,
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
    console.error('Error updating registration:', error);
    return NextResponse.json({ error: 'Error updating registration' }, { status: 500 });
  }
}
