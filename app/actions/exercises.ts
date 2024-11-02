"use server";

import { prisma } from "@/lib/prisma";
import { Exercise, ExerciseType, ExerciseMode } from "@prisma/client";

export type ExerciseFilters = {
  type?: ExerciseType | "ALL";
  mode?: ExerciseMode | "ALL";
  muscleGroup?: string | "ALL";
};

export async function getExercises(
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  filters: ExerciseFilters = {}
): Promise<{ exercises: Exercise[]; total: number }> {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const searchTerms = search.split(" ").filter(Boolean);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (searchTerms.length > 0) {
    where.OR = searchTerms.map((term) => ({
      OR: [
        { name: { contains: term, mode: "insensitive" } },
        { muscleGroups: { hasSome: [term] } },
      ],
    }));
  }

  if (filters.type && filters.type !== "ALL") {
    where.type = filters.type;
  }

  if (filters.mode && filters.mode !== "ALL") {
    where.mode = filters.mode;
  }

  if (filters.muscleGroup && filters.muscleGroup !== "ALL") {
    where.muscleGroups = { hasSome: [filters.muscleGroup] };
  }

  const [exercises, total] = await Promise.all([
    prisma.exercise.findMany({
      where,
      skip,
      take,
      orderBy: { name: "asc" },
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
  muscleGroups: string[];
  type: ExerciseType;
  mode: ExerciseMode;
  instructions: string;
};

export async function createExercise(data: ExerciseInput): Promise<Exercise> {
  return prisma.exercise.create({
    data,
  });
}

export async function updateExercise(
  id: string,
  data: ExerciseInput
): Promise<Exercise> {
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
