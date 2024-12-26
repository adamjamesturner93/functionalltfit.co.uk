'use server';

import { Unit } from '@prisma/client';
import { z } from 'zod';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().optional(),
  weightUnit: z.nativeEnum(Unit),
  lengthUnit: z.nativeEnum(Unit),
  // image: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export async function getCurrentUser(userId?: string) {
  if (!userId) {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }
    userId = session.user.id;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
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

export async function updateProfile(userId: string, formData: FormData) {
  const validatedFields = profileSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    dateOfBirth: formData.get('dateOfBirth'),
    weightUnit: formData.get('weightUnit'),
    lengthUnit: formData.get('lengthUnit'),
    // image: formData.get('image'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { name, email, dateOfBirth, weightUnit, lengthUnit } = validatedFields.data;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        // image,
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
