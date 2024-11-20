'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const healthDataSchema = z.object({
  date: z.string(),
  weight: z.number().positive(),
  bloodPressureSystolic: z.number().int().positive().optional(),
  bloodPressureDiastolic: z.number().int().positive().optional(),
  restingHeartRate: z.number().int().positive().optional(),
  sleepHours: z.number().positive().optional(),
  stressLevel: z.number().int().min(1).max(10).optional(),
});

const bodyMeasurementSchema = z.object({
  date: z.string(),
  weight: z.number().positive(),
  calve: z.number().positive().optional(),
  thigh: z.number().positive().optional(),
  waist: z.number().positive().optional(),
  hips: z.number().positive().optional(),
  butt: z.number().positive().optional(),
  chest: z.number().positive().optional(),
  arm: z.number().positive().optional(),
});

export type HealthDataInput = z.infer<typeof healthDataSchema>;
export type BodyMeasurementInput = z.infer<typeof bodyMeasurementSchema>;

export async function addHealthData(data: HealthDataInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  const validatedData = healthDataSchema.parse(data);

  try {
    await prisma.healthData.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        userId: session.user.id,
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding health data:', error);
    return { error: 'Failed to add health data' };
  }
}

export async function addBodyMeasurement(data: BodyMeasurementInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  const validatedData = bodyMeasurementSchema.parse(data);

  try {
    // Check if a measurement already exists for the given date
    const existingMeasurement = await prisma.bodyMeasurement.findFirst({
      where: {
        userId: session.user.id,
        date: new Date(validatedData.date),
      },
    });

    if (existingMeasurement) {
      return { error: 'A measurement for this date already exists' };
    }

    // If no existing measurement, create a new one
    await prisma.bodyMeasurement.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        userId: session.user.id,
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding body  measurement:', error);
    return { error: 'Failed to add body measurement' };
  }
}

export async function getHealthData(userId: string, days: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return prisma.healthData.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });
}

export async function getBodyMeasurements(userId: string, days: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return prisma.bodyMeasurement.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });
}
