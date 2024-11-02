"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { programmeSchema, ProgrammeFormData } from "@/lib/schemas/programme";

export async function getProgrammes() {
  return prisma.programme.findMany();
}

export async function getProgramme(id: string) {
  return prisma.programme.findUnique({
    where: { id },
    include: { activities: true },
  });
}

export async function createProgramme(data: ProgrammeFormData) {
  const validatedData = programmeSchema.parse(data);
  const { activities, ...programmeData } = validatedData;
  const programme = await prisma.programme.create({
    data: {
      ...programmeData,
      activities: {
        create: activities.map((activity) => ({
          week: activity.week,
          day: activity.day,
          activityType: activity.activityType,
          workoutId: activity.workoutId,
          yogaVideoId: activity.yogaVideoId,
        })),
      },
    },
  });
  revalidatePath("/admin/content/programmes");
  return programme;
}

export async function updateProgramme(id: string, data: ProgrammeFormData) {
  const validatedData = programmeSchema.parse(data);
  const { activities, ...programmeData } = validatedData;
  const programme = await prisma.programme.update({
    where: { id },
    data: {
      ...programmeData,
      activities: {
        deleteMany: {},
        create: activities.map((activity) => ({
          week: activity.week,
          day: activity.day,
          activityType: activity.activityType,
          workoutId: activity.workoutId,
          yogaVideoId: activity.yogaVideoId,
        })),
      },
    },
  });

  revalidatePath("/admin/content/programmes");
  revalidatePath(`/admin/content/programmes/${id}`);
  return programme;
}

export async function deleteProgramme(id: string) {
  await prisma.programme.delete({ where: { id } });
  revalidatePath("/admin/content/programmes");
}
