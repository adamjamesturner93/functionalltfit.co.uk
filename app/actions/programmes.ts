'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { programmeSchema, ProgrammeFormData, Programme } from '@/lib/schemas/programme';
import { Prisma, ProgrammeActivity, UserProgramme } from '@prisma/client';

export type ProgrammeActivityWithName = Omit<ProgrammeActivity, 'activityType'> & {
  activityType: 'WORKOUT' | 'YOGA';
  name: string;
};

export type ProgrammeWithActivities = Programme & {
  activities: ProgrammeActivityWithName[];
};

export type UserProgrammeWithProgress = Omit<UserProgramme, 'progress'> & {
  programme: ProgrammeWithActivities;
  progress: number;
};

export type ProgrammeWithActivitiesAndSaved = Prisma.ProgrammeGetPayload<{
  include: {
    activities: {
      include: {
        workout: {
          select: {
            id: true;
            name: true;
            totalLength: true;
            equipment: true;
          };
        };
        yogaVideo: {
          select: {
            id: true;
            title: true;
            duration: true;
            props: true;
          };
        };
      };
    };
    savedBy: {
      where: {
        userId: string;
      };
      select: {
        id: true;
      };
    };
  };
}> & {
  isSaved: boolean;
};

export async function getProgramme(
  id: string,
  userId?: string,
): Promise<ProgrammeWithActivitiesAndSaved | null> {
  const programme = await prisma.programme.findUnique({
    where: { id },
    include: {
      activities: {
        include: {
          workout: {
            select: {
              id: true,
              name: true,
              totalLength: true,
              equipment: true,
            },
          },
          yogaVideo: {
            select: {
              id: true,
              title: true,
              duration: true,
              props: true,
            },
          },
        },
      },
      savedBy: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
    },
  });

  if (!programme) return null;

  return {
    ...programme,
    isSaved: userId ? programme.savedBy.length > 0 : false,
    activities: programme.activities.map((activity) => ({
      ...activity,
      name: activity.workout?.name || activity.yogaVideo?.title || '',
    })),
  };
}

export async function toggleProgrammeSave(programmeId: string, userId: string) {
  const existingSave = await prisma.userProgrammeSave.findUnique({
    where: {
      userId_programmeId: {
        userId,
        programmeId,
      },
    },
  });

  if (existingSave) {
    await prisma.userProgrammeSave.delete({
      where: {
        id: existingSave.id,
      },
    });
  } else {
    await prisma.userProgrammeSave.create({
      data: {
        userId,
        programmeId,
      },
    });
  }

  revalidatePath('/programmes');
  revalidatePath(`/programmes/${programmeId}`);
}

export async function getUniqueIntentions(): Promise<string[]> {
  const intentions = await prisma.programme.findMany({
    select: {
      intention: true,
    },
    distinct: ['intention'],
  });

  return intentions.map((i) => i.intention);
}

export async function getUniqueLengths(): Promise<string[]> {
  const lengths = await prisma.programme.findMany({
    select: {
      weeks: true,
    },
    distinct: ['weeks'],
    orderBy: {
      weeks: 'asc',
    },
  });

  return lengths.map((l) => `${l.weeks} weeks`);
}

export async function getProgrammes(
  page: number = 1,
  pageSize: number = 9,
  search: string = '',
  filters: {
    intention?: string;
    length?: string;
    minSessions?: number;
    maxSessions?: number;
    saved?: boolean;
  } = {},
  userId?: string,
) {
  const where: Prisma.ProgrammeWhereInput = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(filters.intention &&
      filters.intention !== 'all' && {
        intention: { equals: filters.intention, mode: 'insensitive' },
      }),
    ...(filters.length &&
      filters.length !== 'all' && {
        weeks: parseInt(filters.length.split(' ')[0]),
      }),
    ...(filters.minSessions && {
      sessionsPerWeek: { gte: filters.minSessions },
    }),
    ...(filters.maxSessions && {
      sessionsPerWeek: { lte: filters.maxSessions },
    }),
    ...(filters.saved &&
      userId && {
        savedBy: {
          some: {
            userId,
          },
        },
      }),
  };

  const [programmes, total] = await Promise.all([
    prisma.programme.findMany({
      where,
      include: {
        savedBy: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.programme.count({ where }),
  ]);

  return {
    programmes: programmes.map((programme) => ({
      ...programme,
      isSaved: userId ? programme.savedBy.length > 0 : false,
      savedBy: undefined,
    })),
    total,
  };
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
    include: { activities: true },
  });
  revalidatePath('/admin/content/programmes');
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
    include: { activities: true },
  });

  revalidatePath('/admin/content/programmes');
  revalidatePath(`/admin/content/programmes/${id}`);
  return programme;
}

export async function deleteProgramme(id: string) {
  await prisma.programme.delete({ where: { id } });
  revalidatePath('/admin/content/programmes');
}

export async function getUserProgramme(userId: string): Promise<UserProgrammeWithProgress | null> {
  const userProgramme = await prisma.userProgramme.findFirst({
    where: { userId, isActive: true },
    include: {
      programme: {
        include: {
          activities: {
            include: {
              workout: true,
              yogaVideo: true,
            },
          },
        },
      },
    },
  });

  if (!userProgramme) return null;

  const activitiesWithNames: ProgrammeActivityWithName[] = userProgramme.programme.activities.map(
    (activity) => ({
      ...activity,
      activityType: activity.activityType as 'WORKOUT' | 'YOGA',
      name: activity.workout?.name || activity.yogaVideo?.title || '',
    }),
  );

  const completedActivities = activitiesWithNames.filter((activity) => activity.completed).length;
  const totalActivities = activitiesWithNames.length;
  const progress = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  return {
    ...userProgramme,
    programme: {
      ...userProgramme.programme,
      activities: activitiesWithNames,
    },
    progress,
  };
}

export async function startProgramme(userId: string, programmeId: string) {
  // First, deactivate any existing active programmes
  await prisma.userProgramme.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false, endDate: new Date() },
  });

  // Then, create a new active programme
  const newUserProgramme = await prisma.userProgramme.create({
    data: {
      userId,
      programmeId,
      startDate: new Date(),
      isActive: true,
      progress: 0,
    },
  });

  revalidatePath('/dashboard');
  revalidatePath('/programmes');
  return newUserProgramme;
}

export async function leaveProgramme(userId: string, programmeId: string) {
  await prisma.userProgramme.updateMany({
    where: { userId, programmeId, isActive: true },
    data: { isActive: false, endDate: new Date() },
  });

  revalidatePath('/dashboard');
  revalidatePath('/programmes');
}

export async function updateActivityCompletion(
  userId: string,
  activityId: string,
  completed: boolean,
) {
  await prisma.programmeActivity.update({
    where: { id: activityId },
    data: { completed },
  });

  const userProgramme = await prisma.userProgramme.findFirst({
    where: { userId, isActive: true },
    include: { programme: { include: { activities: true } } },
  });

  if (userProgramme) {
    const completedActivities = userProgramme.programme.activities.filter(
      (a) => a.completed,
    ).length;
    const totalActivities = userProgramme.programme.activities.length;
    const progress = (completedActivities / totalActivities) * 100;

    await prisma.userProgramme.update({
      where: { id: userProgramme.id },
      data: { progress },
    });
  }

  revalidatePath('/dashboard');
  revalidatePath('/programmes');
}

// Add this new function to automatically update activity completion
export async function autoUpdateActivityCompletion(
  userId: string,
  activityType: 'WORKOUT' | 'YOGA',
  activityId: string,
) {
  const userProgramme = await prisma.userProgramme.findFirst({
    where: { userId, isActive: true },
    include: {
      programme: {
        include: {
          activities: true,
        },
      },
    },
  });

  if (userProgramme) {
    const activity = userProgramme.programme.activities.find(
      (a) =>
        (a.activityType === 'WORKOUT' && a.workoutId === activityId) ||
        (a.activityType === 'YOGA' && a.yogaVideoId === activityId),
    );

    if (activity) {
      await updateActivityCompletion(userId, activity.id, true);
    }
  }
}
