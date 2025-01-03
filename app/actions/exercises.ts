'use server';

import { Exercise, ExerciseMode, ExerciseType } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export type ExerciseFilters = {
  type?: ExerciseType | 'ALL';
  mode?: ExerciseMode | 'ALL';
  muscleGroup?: string | 'ALL';
};

export async function getExercises(
  page: number = 1,
  pageSize: number = 10,
  search: string = '',
  filters: ExerciseFilters = {},
): Promise<{ exercises: Exercise[]; total: number }> {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const searchTerms = search.split(' ').filter(Boolean);

  const where: any = {};

  if (searchTerms.length > 0) {
    where.OR = searchTerms.map((term) => ({
      OR: [
        { name: { contains: term, mode: 'insensitive' } },
        { primaryMuscles: { hasSome: [term] } },
      ],
    }));
  }

  if (filters.type && filters.type !== 'ALL') {
    where.type = filters.type;
  }

  if (filters.mode && filters.mode !== 'ALL') {
    where.mode = filters.mode;
  }

  if (filters.muscleGroup && filters.muscleGroup !== 'ALL') {
    where.primaryMuscles = { hasSome: [filters.muscleGroup] };
  }

  const [exercises, total] = await Promise.all([
    prisma.exercise.findMany({
      where,
      skip,
      take,
      orderBy: { name: 'asc' },
    }),
    prisma.exercise.count({ where }),
  ]);

  return { exercises, total };
}

export async function getExerciseById(id: string): Promise<Exercise | null> {
  return prisma.exercise.findUnique({
    where: { id },
  });
}

export type ExerciseInput = {
  name: string;
  thumbnailUrl: string;
  videoUrl: string;
  primaryMuscles: string[];
  type: ExerciseType;
  mode: ExerciseMode;
  instructions: string;
};

export async function createExercise(data: ExerciseInput): Promise<Exercise> {
  return prisma.exercise.create({
    data,
  });
}

export async function updateExercise(id: string, data: ExerciseInput): Promise<Exercise> {
  return prisma.exercise.update({
    where: { id },
    data,
  });
}

export async function deleteExercise(id: string): Promise<Exercise> {
  return prisma.exercise.delete({
    where: { id },
  });
}
