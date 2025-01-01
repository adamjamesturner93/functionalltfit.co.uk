'use server';

import { ExerciseMode, Prisma, SetType, UserExerciseWeight, Workout } from '@prisma/client';
import { WorkoutActivity, WorkoutActivityExercise, WorkoutActivitySet } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { calculateImprovements, calculateNextWorkoutWeight } from '@/lib/workout-calculations';

import { autoUpdateActivityCompletion } from './programmes';

interface WorkoutActivityWithSets extends WorkoutActivity {
  sets: (WorkoutActivitySet & {
    exercises: WorkoutActivityExercise[];
  })[];
}

interface ExerciseGroup {
  exercise: {
    id: string;
    name: string;
    mode: ExerciseMode;
    targetReps?: number | null;
  };
  performances: Array<{
    id: string;
    exerciseId: string;
    weight: number;
    reps: number | null;
    time: number | null;
    distance: number | null;
    roundNumber: number;
  }>;
}

export interface ExerciseSummary {
  id: string;
  exerciseId: string;
  name: string;
  weight: number;
  reps: number;
  time?: number;
  distance?: number;
  targetReps: number;
  targetRounds: number;
  targetWeight: number;
  targetReached: boolean;
  improvement: {
    reps: number;
    weight: number;
    time: number;
    distance: number;
    totalWeight: number;
  };
  nextWorkoutWeight: number;
  performanceByRound: {
    round: number;
    weight: number;
    reps: number;
    time?: number;
    distance?: number;
  }[];
  mode: ExerciseMode;
}

export interface WorkoutSummary {
  totalDuration: number;
  totalWeightLifted: number;
  exercisesCompleted: number;
  weightLiftedImprovement: number | null;
  exercises: ExerciseSummary[];
}

export interface CompletedWorkout {
  id: string;
  workoutId: string;
  name: string;
  completedAt: string;
  totalDuration: number;
  totalWeightLifted: number;
}

export interface WorkoutWithCount extends Workout {
  _count: {
    WorkoutActivity: number;
  };
  isSaved?: boolean;
}

export type WorkoutWithSets = Prisma.WorkoutGetPayload<{
  include: {
    sets: {
      include: {
        exercises: {
          include: {
            exercise: true;
          };
        };
      };
    };
    warmup: {
      include: {
        exercise: true;
      };
    };
    cooldown: {
      include: {
        exercise: true;
      };
    };
  };
}>;

export type WorkoutFilters = {
  equipment?: string;
  muscleGroup?: string;
  minDuration?: number;
  maxDuration?: number;
  saved?: boolean;
};

export type WorkoutInput = {
  name: string;
  description?: string;
  totalLength: number;
  equipment: string[];
  primaryMuscles: string[];
  warmup: { exerciseId: string; duration: number }[];
  cooldown: { exerciseId: string; duration: number }[];
  sets: {
    type: SetType;
    rounds: number;
    rest: number;
    gap?: number;
    exercises: {
      exerciseId: string;
      mode: ExerciseMode;
      targetReps: number;
      targetTime: number;
      targetDistance: number;
      order: number;
    }[];
  }[];
};

export async function getWorkouts(
  page: number = 1,
  pageSize: number = 10,
  search: string = '',
  filters: WorkoutFilters = {},
  userId?: string | null,
): Promise<{ workouts: WorkoutWithCount[]; total: number }> {
  const skip = (page - 1) * pageSize;

  const where: Prisma.WorkoutWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (filters.equipment) {
    where.equipment = { has: filters.equipment };
  }

  if (filters.muscleGroup) {
    where.primaryMuscles = { has: filters.muscleGroup };
  }

  if (filters.minDuration || filters.maxDuration) {
    where.totalLength = {};
    if (filters.minDuration) {
      where.totalLength.gte = filters.minDuration * 60;
    }
    if (filters.maxDuration) {
      where.totalLength.lte = filters.maxDuration * 60;
    }
  }

  if (filters.saved && userId) {
    where.savedBy = {
      some: {
        userId: userId,
      },
    };
  }

  const [workouts, total] = await Promise.all([
    prisma.workout.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { name: 'asc' },
      include: {
        savedBy: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
        _count: {
          select: { WorkoutActivity: true },
        },
      },
    }),
    prisma.workout.count({ where }),
  ]);

  return {
    workouts: workouts.map((workout) => ({
      ...workout,
      isSaved: workout.savedBy ? workout.savedBy.length > 0 : false,
      savedBy: undefined, // Remove savedBy from the response
    })),
    total,
  };
}

export async function getWorkoutById(id: string, userId?: string | null) {
  const workout = await prisma.workout.findUnique({
    where: { id },
    include: {
      sets: {
        include: {
          exercises: {
            include: {
              exercise: true,
            },
          },
        },
      },
      warmup: {
        include: {
          exercise: true,
        },
      },
      cooldown: {
        include: {
          exercise: true,
        },
      },
      savedBy: userId
        ? {
            where: { userId },
          }
        : false,
    },
  });

  if (!workout) return null;

  return {
    ...workout,
    isSaved: userId ? workout.savedBy.length > 0 : false,
    savedBy: undefined, // Remove savedBy from the response
  };
}

export async function toggleWorkoutSave(workoutId: string, userId: string) {
  const existingSave = await prisma.userWorkoutSave.findUnique({
    where: {
      userId_workoutId: {
        userId,
        workoutId,
      },
    },
  });

  if (existingSave) {
    await prisma.userWorkoutSave.delete({
      where: {
        id: existingSave.id,
      },
    });
  } else {
    await prisma.userWorkoutSave.create({
      data: {
        userId,
        workoutId,
      },
    });
  }

  revalidatePath('/workouts');
  revalidatePath(`/workouts/${workoutId}`);
}

export async function createWorkout(data: WorkoutInput): Promise<Workout> {
  const workout = await prisma.workout.create({
    data: {
      name: data.name,
      description: data.description,
      totalLength: data.totalLength,
      equipment: data.equipment,
      primaryMuscles: data.primaryMuscles,
      warmup: {
        create: data.warmup.map((exercise) => ({
          exercise: { connect: { id: exercise.exerciseId } },
          duration: exercise.duration,
        })),
      },
      cooldown: {
        create: data.cooldown.map((exercise) => ({
          exercise: { connect: { id: exercise.exerciseId } },
          duration: exercise.duration,
        })),
      },
      sets: {
        create: data.sets.map((set) => ({
          type: set.type,
          rounds: set.rounds,
          rest: set.rest,
          gap: set.gap,
          exercises: {
            create: set.exercises.map((exercise) => ({
              exercise: { connect: { id: exercise.exerciseId } },
              mode: exercise.mode,
              targetReps: exercise.targetReps,
              targetTime: exercise.targetTime,
              targetDistance: exercise.targetDistance,
              order: exercise.order,
            })),
          },
        })),
      },
    },
    include: {
      warmup: {
        include: {
          exercise: true,
        },
      },
      cooldown: {
        include: {
          exercise: true,
        },
      },
      sets: {
        include: {
          exercises: {
            include: {
              exercise: true,
            },
          },
        },
      },
    },
  });

  revalidatePath('/admin/content/workouts');
  return workout;
}

export async function updateWorkout(id: string, data: WorkoutInput): Promise<Workout> {
  // Delete existing related data
  await prisma.$transaction([
    prisma.warmupExercise.deleteMany({ where: { workoutId: id } }),
    prisma.cooldownExercise.deleteMany({ where: { workoutId: id } }),
    prisma.setExercise.deleteMany({ where: { set: { workoutId: id } } }),
    prisma.set.deleteMany({ where: { workoutId: id } }),
  ]);

  // Update the workout with new data
  const updatedWorkout = await prisma.workout.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      totalLength: data.totalLength,
      equipment: data.equipment,
      primaryMuscles: data.primaryMuscles,
      warmup: {
        create: data.warmup.map((exercise) => ({
          exercise: { connect: { id: exercise.exerciseId } },
          duration: exercise.duration,
        })),
      },
      cooldown: {
        create: data.cooldown.map((exercise) => ({
          exercise: { connect: { id: exercise.exerciseId } },
          duration: exercise.duration,
        })),
      },
      sets: {
        create: data.sets.map((set) => ({
          type: set.type,
          rounds: set.rounds,
          rest: set.rest,
          gap: set.gap,
          exercises: {
            create: set.exercises.map((exercise) => ({
              exercise: { connect: { id: exercise.exerciseId } },
              mode: exercise.mode,
              targetReps: exercise.targetReps,
              targetTime: exercise.targetTime,
              targetDistance: exercise.targetDistance,
              order: exercise.order,
            })),
          },
        })),
      },
    },
    include: {
      warmup: {
        include: {
          exercise: true,
        },
      },
      cooldown: {
        include: {
          exercise: true,
        },
      },
      sets: {
        include: {
          exercises: {
            include: {
              exercise: true,
            },
          },
        },
      },
    },
  });

  revalidatePath('/admin/content/workouts');
  revalidatePath(`/admin/content/workouts/${id}`);
  return updatedWorkout;
}

export async function deleteWorkout(id: string): Promise<Workout> {
  const workout = await prisma.workout.delete({
    where: { id },
  });
  revalidatePath('/admin/content/workouts');
  return workout;
}

export async function startWorkout(workoutId: string, userId: string) {
  try {
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
      include: {
        warmup: {
          include: {
            exercise: true,
          },
        },
        cooldown: {
          include: {
            exercise: true,
          },
        },
        sets: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
            },
          },
        },
      },
    });

    if (!workout) {
      throw new Error('Workout not found');
    }

    const workoutActivity = await prisma.workoutActivity.create({
      data: {
        userId: userId,
        workoutId: workoutId,
        startedAt: new Date(),
      },
    });

    // Fetch the most recent completed workout activity for this workout and user
    const previousWorkoutActivity = await prisma.workoutActivity.findFirst({
      where: {
        userId: userId,
        workoutId: workoutId,
        endedAt: { not: null },
      },
      orderBy: {
        endedAt: 'desc',
      },
      include: {
        WorkoutActivityExercise: true,
      },
    });

    // Fetch user's saved weights for exercises in this workout
    const userExerciseWeights = await prisma.userExerciseWeight.findMany({
      where: {
        userId: userId,
        workoutId: workoutId,
      },
    });

    const combinedWorkout = {
      ...workout,
      id: workoutActivity.id,
      workoutId: workout.id,
      warmup: await Promise.all(
        workout.warmup.map(async (warmupExercise) => {
          const previousPerformance = previousWorkoutActivity?.WorkoutActivityExercise.find(
            (e) => e.exerciseId === warmupExercise.exerciseId,
          );
          return {
            ...warmupExercise.exercise,
            exerciseId: warmupExercise.exerciseId,
            duration: warmupExercise.duration,
            previousPerformance: previousPerformance
              ? {
                  time: previousPerformance.time,
                }
              : null,
          };
        }),
      ),
      cooldown: await Promise.all(
        workout.cooldown.map(async (cooldownExercise) => {
          const previousPerformance = previousWorkoutActivity?.WorkoutActivityExercise.find(
            (e) => e.exerciseId === cooldownExercise.exerciseId,
          );
          return {
            ...cooldownExercise.exercise,
            exerciseId: cooldownExercise.exerciseId,
            duration: cooldownExercise.duration,
            previousPerformance: previousPerformance
              ? {
                  time: previousPerformance.time,
                }
              : null,
          };
        }),
      ),
      sets: await Promise.all(
        workout.sets.map(async (set) => ({
          ...set,
          exercises: await Promise.all(
            set.exercises.map(async (setExercise) => {
              const userWeight = userExerciseWeights.find(
                (uw) => uw.exerciseId === setExercise.exercise.id,
              );
              const previousPerformance = previousWorkoutActivity?.WorkoutActivityExercise.find(
                (e) => e.exerciseId === setExercise.exercise.id,
              );
              return {
                ...setExercise.exercise,
                exerciseId: setExercise.exerciseId,
                targetReps: setExercise.targetReps,
                targetTime: setExercise.targetTime,
                targetDistance: setExercise.targetDistance,
                mode: setExercise.mode,
                weight: userWeight?.weight || 0,
                previousPerformance: previousPerformance
                  ? {
                      weight: previousPerformance.weight,
                      reps: previousPerformance.reps,
                      time: previousPerformance.time,
                      distance: previousPerformance.distance,
                    }
                  : null,
              };
            }),
          ),
        })),
      ),
    };

    return combinedWorkout;
  } catch (error) {
    console.error('Error starting workout:', error);
    throw error;
  }
}

export async function completeWorkout(
  workoutActivityId: string,
  workoutId: string,
  userId: string,
) {
  try {
    const workoutActivity = await prisma.workoutActivity.findUnique({
      where: { id: workoutActivityId },
      include: {
        workout: {
          include: {
            sets: {
              include: {
                exercises: true,
              },
            },
          },
        },
        WorkoutActivityExercise: true,
      },
    });

    if (!workoutActivity) {
      throw new Error('Workout activity not found');
    }

    const exercisesFromDb = workoutActivity.WorkoutActivityExercise;

    if (!exercisesFromDb || exercisesFromDb.length === 0) {
      throw new Error('No exercises found for this workout activity');
    }

    const result = await prisma.$transaction(async (prisma) => {
      let totalWeightLifted = 0;

      const updatedExercises = exercisesFromDb
        .map((exercise) => {
          const workoutExercise = workoutActivity.workout.sets
            .flatMap((set) => set.exercises)
            .find((e) => e.exerciseId === exercise.exerciseId);

          if (workoutExercise) {
            if (exercise.weight && exercise.reps) {
              totalWeightLifted += exercise.weight * exercise.reps;
            }

            return prisma.userExerciseWeight.upsert({
              where: {
                userId_workoutId_exerciseId: {
                  userId: workoutActivity.userId,
                  workoutId: workoutId,
                  exerciseId: exercise.exerciseId,
                },
              },
              update: {
                weight: exercise.weight,
              },
              create: {
                userId: workoutActivity.userId,
                workoutId: workoutId,
                exerciseId: exercise.exerciseId,
                weight: exercise.weight,
              },
            });
          }
          return null;
        })
        .filter(
          (update): update is Prisma.Prisma__UserExerciseWeightClient<UserExerciseWeight> =>
            update !== null,
        );

      await Promise.all(updatedExercises);

      await prisma.workoutActivity.update({
        where: { id: workoutActivityId },
        data: {
          endedAt: new Date(),
        },
      });

      // Call autoUpdateActivityCompletion
      await autoUpdateActivityCompletion(userId, 'WORKOUT', workoutId);

      return { success: true, message: 'Workout completed successfully' };
    });

    return {
      ...result,
      redirectUrl: `/workouts/${workoutActivityId}/summary`,
    };
  } catch (error) {
    console.error('Error completing workout:', error);
    throw error;
  }
}
export async function updateWorkoutActivity(
  workoutActivityId: string,
  exercises: {
    id: string;
    exerciseId: string;
    weight?: number;
    reps?: number;
    time?: number;
    distance?: number;
    roundNumber: number;
    mode: ExerciseMode;
  }[],
) {
  try {
    const workoutActivity = await prisma.workoutActivity.findUnique({
      where: { id: workoutActivityId },
      include: {
        workout: {
          include: {
            sets: {
              include: {
                exercises: {
                  include: {
                    exercise: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!workoutActivity) {
      console.error(`Workout activity with id ${workoutActivityId} not found`);
      return { error: 'Workout activity not found' };
    }

    const { sets } = workoutActivity.workout;

    const updatedExercises = await Promise.all(
      exercises.map(async (exercise) => {
        const set = sets.find((s) => s.exercises.some((e) => e.exerciseId === exercise.exerciseId));

        if (set) {
          const workoutActivitySet = await prisma.workoutActivitySet.upsert({
            where: {
              workoutActivityId_setNumber_roundNumber: {
                workoutActivityId: workoutActivityId,
                setNumber: 1, // Assuming one set per exercise, adjust if needed
                roundNumber: exercise.roundNumber,
              },
            },
            update: {},
            create: {
              workoutActivityId: workoutActivityId,
              setNumber: 1, // Assuming one set per exercise, adjust if needed
              roundNumber: exercise.roundNumber,
            },
          });

          const exerciseData: {
            weight?: number;
            reps?: number;
            time?: number;
            distance?: number;
            mode: ExerciseMode;
          } = {
            mode: exercise.mode,
          };

          if (exercise.weight !== undefined) exerciseData.weight = exercise.weight;
          if (exercise.reps !== undefined) exerciseData.reps = exercise.reps;
          if (exercise.time !== undefined) exerciseData.time = exercise.time;
          if (exercise.distance !== undefined) exerciseData.distance = exercise.distance;

          return prisma.workoutActivityExercise.upsert({
            where: {
              workoutActivitySetId_exerciseId_roundNumber: {
                workoutActivitySetId: workoutActivitySet.id,
                exerciseId: exercise.exerciseId,
                roundNumber: exercise.roundNumber,
              },
            },
            update: exerciseData,
            create: {
              workoutActivityId: workoutActivityId,
              workoutActivitySetId: workoutActivitySet.id,
              exerciseId: exercise.exerciseId,
              roundNumber: exercise.roundNumber,
              weight: exerciseData.weight || 0, // Provide a default value
              ...exerciseData,
            },
          });
        }
      }),
    );

    return { success: true, updatedExercises };
  } catch (error) {
    console.error('Error updating workout activity:', error);
    return { error: 'Failed to update workout activity' };
  }
}

export async function updateUserExerciseWeight(
  workoutActivityId: string,
  exerciseId: string,
  newWeight: number,
  userId: string,
): Promise<void> {
  try {
    const workoutActivity = await prisma.workoutActivity.findUnique({
      where: { id: workoutActivityId },
      include: { workout: true },
    });

    if (!workoutActivity) {
      throw new Error('Workout activity not found');
    }

    const workoutId = workoutActivity.workoutId;

    // Update the user's exercise weight
    await prisma.userExerciseWeight.upsert({
      where: {
        userId_workoutId_exerciseId: {
          userId,
          workoutId,
          exerciseId,
        },
      },
      update: {
        weight: newWeight,
      },
      create: {
        userId,
        workoutId,
        exerciseId,
        weight: newWeight,
      },
    });

    // Optionally, you can update the workout activity exercise as well
    await prisma.workoutActivityExercise.updateMany({
      where: {
        workoutActivityId,
        exerciseId,
      },
      data: {
        weight: newWeight,
      },
    });
  } catch (error) {
    console.error('Error updating user exercise weight:', error);
    throw error;
  }
}

export async function getUniqueBodyFocuses(): Promise<string[]> {
  const workouts = await prisma.workout.findMany({
    select: {
      primaryMuscles: true,
    },
  });

  const allprimaryMuscles = workouts.flatMap((workout) => workout.primaryMuscles);
  const uniqueprimaryMuscles = Array.from(new Set(allprimaryMuscles)).sort();

  return uniqueprimaryMuscles;
}

export async function getUniqueEquipment(): Promise<string[]> {
  const workouts = await prisma.workout.findMany({
    select: {
      equipment: true,
    },
  });

  const allEquipment = workouts.flatMap((workout) => workout.equipment);
  const uniqueEquipment = Array.from(new Set(allEquipment)).sort();

  return uniqueEquipment;
}

export async function shareWorkout(workoutActivityId: string, userId: string) {
  return {
    shareLink: workoutActivityId + userId,
  };
}

export async function getCompletedWorkouts(): Promise<CompletedWorkout[]> {
  try {
    const completedWorkouts = await prisma.workoutActivity.findMany({
      where: {
        endedAt: { not: null },
      },
      orderBy: {
        endedAt: 'desc',
      },
      select: {
        id: true,
        workoutId: true,
        workout: {
          select: {
            name: true,
          },
        },
        endedAt: true,
        startedAt: true,
        sets: {
          select: {
            exercises: {
              select: {
                weight: true,
                reps: true,
              },
            },
          },
        },
      },
    });

    return completedWorkouts.map((workout) => ({
      id: workout.id,
      workoutId: workout.workoutId,
      name: workout.workout.name,
      completedAt: workout.endedAt!.toISOString(),
      totalDuration: workout.endedAt!.getTime() - workout.startedAt.getTime(),
      totalWeightLifted: workout.sets.reduce(
        (total, set) =>
          total +
          set.exercises.reduce(
            (setTotal, exercise) => setTotal + (exercise.weight || 0) * (exercise.reps || 1),
            0,
          ),
        0,
      ),
    }));
  } catch (error) {
    console.error('Error fetching completed workouts:', error);
    throw error;
  }
}

export async function getWorkoutSummary(workoutActivityId: string): Promise<WorkoutSummary | null> {
  const workoutActivity = await prisma.workoutActivity.findUnique({
    where: { id: workoutActivityId },
    include: {
      workout: {
        include: {
          sets: {
            include: {
              exercises: {
                include: {
                  exercise: true,
                },
              },
            },
          },
        },
      },
      sets: {
        include: {
          exercises: {
            include: {
              exercise: true,
            },
          },
        },
      },
    },
  });

  if (!workoutActivity) {
    return null;
  }

  const totalDuration =
    workoutActivity.endedAt && workoutActivity.startedAt
      ? (workoutActivity.endedAt.getTime() - workoutActivity.startedAt.getTime()) / 1000
      : 0;

  // Group exercises by exerciseId
  const exerciseGroups = workoutActivity.sets.reduce<Record<string, ExerciseGroup>>(
    (groups, set) => {
      set.exercises.forEach((exercise) => {
        if (!groups[exercise.exerciseId]) {
          groups[exercise.exerciseId] = {
            exercise: exercise.exercise,
            performances: [],
          };
        }
        groups[exercise.exerciseId].performances.push({
          ...exercise,
          roundNumber: set.roundNumber,
        });
      });
      return groups;
    },
    {},
  );

  const exercises: ExerciseSummary[] = await Promise.all(
    Object.entries(exerciseGroups).map(async ([exerciseId, group]) => {
      const previousPerformance = await prisma.workoutActivityExercise.findFirst({
        where: {
          exerciseId,
          workoutActivity: {
            userId: workoutActivity.userId,
            endedAt: { lt: workoutActivity.startedAt },
          },
        },
        orderBy: { workoutActivity: { endedAt: 'desc' } },
      });

      // Get the target from the workout's exercise configuration
      const workoutExercise = workoutActivity.workout.sets
        .flatMap((s) => s.exercises)
        .find((e) => e.exerciseId === exerciseId);

      const targetReps = workoutExercise?.targetReps || 0;

      // Calculate averages across all performances
      const totalWeight = group.performances.reduce((sum, p) => sum + p.weight, 0);
      const totalReps = group.performances.reduce((sum, p) => sum + (p.reps || 0), 0);
      const totalTime = group.performances.reduce((sum, p) => sum + (p.time || 0), 0);
      const totalDistance = group.performances.reduce((sum, p) => sum + (p.distance || 0), 0);

      const averageWeight = totalWeight / group.performances.length;
      const averageReps = totalReps / group.performances.length;
      const averageTime = totalTime / group.performances.length;
      const averageDistance = totalDistance / group.performances.length;

      // Check if target is reached based on the best performance
      const bestPerformance = group.performances.reduce((best, current) => {
        switch (group.exercise.mode) {
          case 'REPS':
            return (current.reps || 0) > (best.reps || 0) ? current : best;
          case 'TIME':
            return (current.time || 0) > (best.time || 0) ? current : best;
          case 'DISTANCE':
            return (current.distance || 0) > (best.distance || 0) ? current : best;
          default:
            return best;
        }
      }, group.performances[0]);

      const targetReached =
        group.exercise.mode === 'REPS'
          ? (bestPerformance.reps || 0) >= targetReps && (bestPerformance.reps || 0) > 0
          : group.exercise.mode === 'TIME'
            ? (bestPerformance.time || 0) >= targetReps && (bestPerformance.time || 0) > 0
            : (bestPerformance.distance || 0) >= targetReps && (bestPerformance.distance || 0) > 0;

      const improvement = calculateImprovements(
        {
          id: bestPerformance.id,
          exerciseId,
          name: group.exercise.name,
          weight: averageWeight,
          reps: averageReps,
          time: averageTime,
          distance: averageDistance,
          targetReps,
          targetRounds: Math.max(...group.performances.map((p) => p.roundNumber)),
          targetWeight: averageWeight,
          targetReached,
          improvement: {
            reps: 0,
            weight: 0,
            time: 0,
            distance: 0,
            totalWeight: 0,
          },
          nextWorkoutWeight: 0,
          performanceByRound: [],
          mode: group.exercise.mode,
        },
        previousPerformance
          ? {
              id: previousPerformance.id,
              exerciseId: previousPerformance.exerciseId,
              name: group.exercise.name,
              weight: previousPerformance.weight,
              reps: previousPerformance.reps || 0,
              time: previousPerformance.time || 0,
              distance: previousPerformance.distance || 0,
              targetReps,
              targetRounds: Math.max(...group.performances.map((p) => p.roundNumber)),
              targetWeight: previousPerformance.weight,
              targetReached: false,
              improvement: {
                reps: 0,
                weight: 0,
                time: 0,
                distance: 0,
                totalWeight: 0,
              },
              nextWorkoutWeight: 0,
              performanceByRound: [],
              mode: group.exercise.mode,
            }
          : null,
      );

      const nextWorkoutWeight = calculateNextWorkoutWeight(averageWeight, targetReached);

      return {
        id: bestPerformance.id,
        exerciseId,
        name: group.exercise.name,
        weight: averageWeight,
        reps: averageReps,
        time: averageTime,
        distance: averageDistance,
        targetReps,
        targetRounds: Math.max(...group.performances.map((p) => p.roundNumber)),
        targetWeight: averageWeight,
        targetReached,
        improvement,
        nextWorkoutWeight,
        performanceByRound: group.performances
          .map((p) => ({
            round: p.roundNumber,
            weight: p.weight,
            reps: p.reps || 0,
            time: p.time || 0,
            distance: p.distance || 0,
          }))
          .sort((a, b) => a.round - b.round),
        mode: group.exercise.mode,
      };
    }),
  );

  const totalWeightLifted = exercises.reduce(
    (total, exercise) =>
      total + exercise.weight * exercise.reps * exercise.performanceByRound.length,
    0,
  );

  const previousWorkout = await prisma.workoutActivity.findFirst({
    where: {
      workoutId: workoutActivity.workoutId,
      userId: workoutActivity.userId,
      endedAt: { lt: workoutActivity.startedAt },
    },
    orderBy: { endedAt: 'desc' },
    include: {
      sets: {
        include: {
          exercises: true,
        },
      },
    },
  });

  const weightLiftedImprovement = previousWorkout
    ? ((totalWeightLifted - calculateTotalWeightLifted(previousWorkout)) /
        calculateTotalWeightLifted(previousWorkout)) *
      100
    : null;

  return {
    totalDuration,
    totalWeightLifted,
    exercisesCompleted: exercises.length,
    weightLiftedImprovement,
    exercises,
  };
}

function calculateTotalWeightLifted(workoutActivity: WorkoutActivityWithSets): number {
  return workoutActivity.sets.reduce(
    (total, set) =>
      total +
      set.exercises.reduce(
        (setTotal, exercise) => setTotal + (exercise.weight || 0) * (exercise.reps || 1),
        0,
      ),
    0,
  );
}
