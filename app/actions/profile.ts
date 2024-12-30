'use server';

import { Unit } from '@prisma/client';
import { z } from 'zod';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import { getActiveGoals } from './goals';
import { getBodyMeasurements } from './health';
import { getUserProgramme } from './programmes';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().optional(),
  weightUnit: z.nativeEnum(Unit),
  lengthUnit: z.nativeEnum(Unit),
  image: z.string().optional(),
  height: z.number().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { preferences: true },
  });

  if (!user) {
    return null;
  }

  return {
    ...user,
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : undefined,
    weightUnit: user.preferences?.weightUnit || Unit.METRIC,
    lengthUnit: user.preferences?.lengthUnit || Unit.METRIC,
    image: user.image || undefined,
  };
}

export async function updateProfile(userId: string, profileData: ProfileFormValues) {
  const validatedFields = profileSchema.safeParse(profileData);

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.flatten() };
  }

  const { name, email, dateOfBirth, weightUnit, lengthUnit, image, height } = validatedFields.data;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        image,
        height,
        preferences: {
          upsert: {
            create: { weightUnit, lengthUnit },
            update: { weightUnit, lengthUnit },
          },
        },
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { error: 'Failed to update profile' };
  }
}

export async function uploadProfileImage(userId: string, formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No file provided' };
  }

  try {
    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image');
    }

    const { url } = await uploadResponse.json();

    await prisma.user.update({
      where: { id: userId },
      data: { image: url },
    });

    return { url };
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return { error: 'Failed to upload profile image' };
  }
}

export async function getExtendedUserProfile(userId: string) {
  const [user, userProgramme, activeGoals] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { preferences: true },
    }),
    getUserProgramme(userId),
    getActiveGoals(userId),
  ]);

  if (!user) {
    return null;
  }

  const today = new Date();
  const startDate = userProgramme ? new Date(userProgramme.startDate) : null;

  let currentWeek = 0;
  let thisWeeksSessions: any = [];
  let nextSession = null;

  if (startDate && userProgramme) {
    const daysSinceStart = Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    currentWeek = Math.min(Math.floor(daysSinceStart / 7) + 1, userProgramme.programme.weeks);

    thisWeeksSessions = userProgramme.programme.activities.filter(
      (activity) => activity.week === currentWeek,
    );

    nextSession = thisWeeksSessions.find((activity: any) => !activity.completed) || null;
  }

  return {
    user: {
      ...user,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : undefined,
      weightUnit: user.preferences?.weightUnit || Unit.METRIC,
      lengthUnit: user.preferences?.lengthUnit || Unit.METRIC,
    },
    activeProgramme: userProgramme
      ? {
          ...userProgramme,
          currentWeek,
          thisWeeksSessions,
          nextSession,
        }
      : null,
    activeGoals,
  };
}
