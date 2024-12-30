'use server';

import { SignJWT } from 'jose';
import { nanoid } from 'nanoid';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { generateAuthCode, sendAuthCode, signOut } from '@/lib/auth';

export async function logout() {
  await signOut();
  redirect('/login');
}

import { User } from '@prisma/client';

import { prisma } from '@/lib/prisma';

const registrationSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format. Use ISO date string.',
  }),
  gender: z.string(),
  fitnessGoals: z.array(z.string()),
  height: z.string(),
  weight: z.string(),
  unitPreference: z.enum(['METRIC', 'IMPERIAL']),
});

export type RegistrationRequest = z.infer<typeof registrationSchema>;

export async function registerUser(data: RegistrationRequest) {
  const result = registrationSchema.safeParse(data);

  if (!result.success) {
    return { error: 'Invalid input', details: result.error.flatten() };
  }

  const { email, name, dateOfBirth, gender, fitnessGoals, height, weight, unitPreference } =
    result.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: 'User already exists' };
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        height: parseFloat(height),
        preferences: {
          create: {
            weightUnit: unitPreference,
            lengthUnit: unitPreference,
          },
        },
        Measurement: {
          create: {
            weight: parseFloat(weight),
            date: new Date(),
          },
        },
        membershipStatus: 'ACTIVE',
        membershipPlan: 'FREE',
        role: 'USER',
      },
    });

    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setJti(nanoid())
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(new TextEncoder().encode(process.env.AUTH_SECRET));

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        membershipStatus: user.membershipStatus,
        membershipPlan: user.membershipPlan,
        role: user.role,
      },
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Failed to register user' };
  }
}

export async function loginUser(email: string) {
  if (!email) {
    return { error: 'Email is required' };
  }

  try {
    let user: User | null = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: '',
          membershipStatus: 'ACTIVE',
          membershipPlan: 'FREE',
          role: 'USER',
        },
      });
    }

    const authCode = generateAuthCode();
    const authCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await prisma.user.update({
      where: { id: user.id },
      data: { authCode, authCodeExpiry },
    });

    await sendAuthCode(email, authCode);

    return {
      message: 'Auth code sent. Check your email.',
      userId: user.id,
    };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Failed to login user' };
  }
}
