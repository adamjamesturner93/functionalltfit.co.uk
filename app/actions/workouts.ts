"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Workout, SetType, Prisma, ExerciseMode } from "@prisma/client";
import { autoUpdateActivityCompletion } from "./programmes";
import { redirect } from "next/navigation";
import {
  calculateImprovements,
  calculateNextWorkoutWeight,
} from "@/lib/workout-calculations";

import {
  WorkoutActivity,
  WorkoutActivitySet,
  WorkoutActivityExercise,
} from "@prisma/client";

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
  muscleGroups: string[];
  sets: {
    type: SetType;
    rounds: number;
    rest: number;
    gap?: number;
    exercises: {
      exerciseId: string;
      targetReps: number;
      order: number;
    }[];
  }[];
};

export async function getWorkouts(
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  filters: WorkoutFilters = {},
  userId?: string | null
) {
  const skip = (page - 1) * pageSize;

  const where: Prisma.WorkoutWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (filters.equipment) {
    where.equipment = { has: filters.equipment };
  }

  if (filters.muscleGroup) {
    where.muscleGroups = { has: filters.muscleGroup };
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
      orderBy: { name: "asc" },
      include: {
        savedBy: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
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

  revalidatePath("/workouts");
}

export async function getWorkoutById(
  id: string
): Promise<WorkoutWithSets | null> {
  return prisma.workout.findUnique({
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
    },
  });
}

export async function createWorkout(data: WorkoutInput): Promise<Workout> {
  const workout = await prisma.workout.create({
    data: {
      name: data.name,
      description: data.description,
      totalLength: data.totalLength,
      equipment: data.equipment,
      muscleGroups: data.muscleGroups,
      sets: {
        create: data.sets.map((set) => ({
          type: set.type,
          rounds: set.rounds,
          rest: set.rest,
          gap: set.gap,
          exercises: {
            create: set.exercises.map((exercise) => ({
              exercise: { connect: { id: exercise.exerciseId } },
              targetReps: exercise.targetReps,
              order: exercise.order,
            })),
          },
        })),
      },
    },
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
  });

  revalidatePath("/admin/content/workouts");
  return workout;
}

export async function updateWorkout(
  id: string,
  data: WorkoutInput
): Promise<Workout> {
  await prisma.setExercise.deleteMany({
    where: {
      set: {
        workoutId: id,
      },
    },
  });
  await prisma.set.deleteMany({
    where: {
      workoutId: id,
    },
  });

  const workout = await prisma.workout.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      totalLength: data.totalLength,
      equipment: data.equipment,
      muscleGroups: data.muscleGroups,
      sets: {
        create: data.sets.map((set) => ({
          type: set.type,
          rounds: set.rounds,
          rest: set.rest,
          gap: set.gap,
          exercises: {
            create: set.exercises.map((exercise) => ({
              exercise: { connect: { id: exercise.exerciseId } },
              targetReps: exercise.targetReps,
              order: exercise.order,
            })),
          },
        })),
      },
    },
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
  });

  revalidatePath("/admin/content/workouts");
  revalidatePath(`/admin/content/workouts/${id}`);
  return workout;
}

export async function deleteWorkout(id: string): Promise<Workout> {
  const workout = await prisma.workout.delete({
    where: { id },
  });
  revalidatePath("/admin/content/workouts");
  return workout;
}

export async function startWorkout(workoutId: string, userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
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
    });

    if (!workout) {
      throw new Error("Workout not found");
    }

    const userExerciseWeights = await prisma.userExerciseWeight.findMany({
      where: {
        userId: userId,
        workoutId: workoutId,
      },
    });

    const previousWorkoutActivity = await prisma.workoutActivity.findFirst({
      where: {
        userId: userId,
        workoutId: workoutId,
      },
      orderBy: {
        startedAt: "desc",
      },
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
    });

    const workoutActivity = await prisma.workoutActivity.create({
      data: {
        workoutId: workout.id,
        userId: userId,
        startedAt: new Date(),
      },
    });

    const combinedWorkout = {
      id: workoutActivity.id,
      workoutId: workout.id,
      name: workout.name,
      description: workout.description,
      totalLength: workout.totalLength,
      equipment: workout.equipment,
      muscleGroups: workout.muscleGroups,
      startedAt: workoutActivity.startedAt.toISOString(),
      endedAt: null,
      sets: workout.sets.map((set) => {
        const setExercises = set.exercises.map((exerciseInSet) => {
          const userWeight = userExerciseWeights.find(
            (uw) => uw.exerciseId === exerciseInSet.exercise.id
          );
          const previousExercises = previousWorkoutActivity?.sets
            .flatMap((set) => set.exercises)
            .filter((wae) => wae.exerciseId === exerciseInSet.exercise.id);

          let weight: number;
          if (userWeight) {
            weight = userWeight.weight;
          } else if (previousExercises && previousExercises.length > 0) {
            weight = previousExercises[0].weight;
          } else {
            weight = 0;
          }

          const previousPerformance =
            previousExercises?.map((prev, index) => ({
              round: index + 1,
              weight: prev.weight,
              reps: prev.reps,
              time: prev.time,
              distance: prev.distance,
            })) || [];

          let targetReps: number | undefined,
            targetTime: number | undefined,
            targetDistance: number | undefined;

          switch (exerciseInSet.exercise.mode) {
            case ExerciseMode.REPS:
              targetReps = exerciseInSet.targetReps;
              break;
            case ExerciseMode.TIME:
              targetTime = exerciseInSet.targetReps;
              break;
            case ExerciseMode.DISTANCE:
              targetDistance = exerciseInSet.targetReps;
              break;
          }

          return {
            id: exerciseInSet.id,
            exerciseId: exerciseInSet.exercise.id,
            name: exerciseInSet.exercise.name,
            targetReps,
            targetTime,
            targetDistance,
            weight: weight,
            equipment: exerciseInSet.exercise.equipment,
            muscleGroups: exerciseInSet.exercise.muscleGroups,
            type: exerciseInSet.exercise.type,
            thumbnailUrl: exerciseInSet.exercise.thumbnailUrl,
            videoUrl: exerciseInSet.exercise.videoUrl,
            mode: exerciseInSet.exercise.mode,
            instructions: exerciseInSet.exercise.instructions,
            previousPerformance,
          };
        });

        const setEquipment = Array.from(
          new Set(
            setExercises.flatMap((exercise) =>
              exercise.equipment.split(",").map((item) => item.trim())
            )
          )
        ).sort();

        return {
          ...set,
          exercises: setExercises,
          equipment: setEquipment,
        };
      }),
    };

    return combinedWorkout;
  } catch (error) {
    console.error("Error starting workout:", error);
    throw error;
  }
}

export async function completeWorkout(
  activityId: string,
  workoutId: string,
  exercises: {
    id: string;
    exerciseId: string;
    weight: { [roundNumber: number]: number };
    reps?: { [roundNumber: number]: number };
    time?: { [roundNumber: number]: number };
    distance?: { [roundNumber: number]: number };
  }[],
  userId: string
) {
  try {
    const workoutActivity = await prisma.workoutActivity.findUnique({
      where: { id: activityId },
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
      throw new Error("Workout activity not found");
    }

    const previousActivities = await prisma.workoutActivity.findMany({
      where: {
        userId,
        workoutId: workoutId,
        id: { not: activityId },
        endedAt: { not: null },
      },
      orderBy: {
        endedAt: "desc",
      },
      include: {
        sets: {
          include: {
            exercises: true,
          },
        },
      },
    });

    const endTime = new Date();

    let totalWeightLifted = 0;

    const updatedExercises = await Promise.all(
      exercises.map(async (exercise) => {
        const workoutExercise = workoutActivity.workout.sets
          .flatMap((set) => set.exercises)
          .find((e) => e.exerciseId === exercise.exerciseId);

        if (!workoutExercise) {
          throw new Error(
            `Exercise with id ${exercise.exerciseId} not found in workout`
          );
        }

        const roundNumbers = Object.keys(exercise.weight).map(Number);
        const totalRounds = Math.max(...roundNumbers);

        let exerciseWeight = 0;
        let exerciseReps = 0;
        let exerciseTime = 0;
        let exerciseDistance = 0;

        const performanceByRound = [];

        for (let round = 1; round <= totalRounds; round++) {
          const roundWeight = exercise.weight[round] || 0;
          const roundReps = exercise.reps?.[round] || 0;
          const roundTime = exercise.time?.[round] || 0;
          const roundDistance = exercise.distance?.[round] || 0;

          exerciseWeight += roundWeight;
          exerciseReps += roundReps;
          exerciseTime += roundTime;
          exerciseDistance += roundDistance;

          performanceByRound.push({
            round,
            weight: roundWeight,
            reps: roundReps,
            time: roundTime,
            distance: roundDistance,
          });

          totalWeightLifted += roundWeight * roundReps;
        }

        type PerformanceType = {
          id: string;
          exerciseId: string;
          weight: number;
          reps: number | null;
          time: number | null;
          distance: number | null;
          workoutActivityId: string;
          roundNumber: number;
          workoutActivitySetId: string;
        };

        const bestPerformance = previousActivities
          .flatMap((activity) => activity.sets)
          .flatMap((set) => set.exercises)
          .filter((e) => e.exerciseId === exercise.exerciseId)
          .reduce<PerformanceType | null>((best, current) => {
            if (!best) return current as PerformanceType;

            // Compare based on exercise mode
            switch (workoutExercise.exercise.mode) {
              case ExerciseMode.REPS:
                return (current.reps || 0) > (best.reps || 0) ? current : best;
              case ExerciseMode.TIME:
                return (current.time || 0) > (best.time || 0) ? current : best;
              case ExerciseMode.DISTANCE:
                return (current.distance || 0) > (best.distance || 0)
                  ? current
                  : best;
              default:
                return best;
            }
          }, null);

        const userExerciseWeight = await prisma.userExerciseWeight.findUnique({
          where: {
            userId_workoutId_exerciseId: {
              userId,
              workoutId,
              exerciseId: exercise.exerciseId,
            },
          },
        });

        const averageWeight = exerciseWeight / totalRounds;
        const averageReps = exerciseReps / totalRounds;
        const averageTime = exerciseTime / totalRounds;
        const averageDistance = exerciseDistance / totalRounds;

        const targetReached =
          workoutExercise.exercise.mode === ExerciseMode.REPS
            ? averageReps >= workoutExercise.targetReps
            : workoutExercise.exercise.mode === ExerciseMode.TIME
            ? averageTime >= workoutExercise.targetReps
            : workoutExercise.exercise.mode === ExerciseMode.DISTANCE
            ? averageDistance >= workoutExercise.targetReps
            : false;

        const nextWorkoutWeight = targetReached
          ? Math.ceil(
              ((userExerciseWeight?.weight || averageWeight) * 1.05) / 2.5
            ) * 2.5
          : userExerciseWeight?.weight || averageWeight;

        const improvement = {
          reps: bestPerformance?.reps ? averageReps - bestPerformance.reps : 0,
          weight: bestPerformance ? averageWeight - bestPerformance.weight : 0,
          time: bestPerformance ? averageTime - (bestPerformance.time || 0) : 0,
          distance: bestPerformance
            ? averageDistance - (bestPerformance.distance || 0)
            : 0,
          totalWeight:
            totalWeightLifted -
            (bestPerformance?.reps
              ? bestPerformance.weight * bestPerformance.reps
              : 0),
        };

        return {
          id: exercise.id,
          exerciseId: exercise.exerciseId,
          name: workoutExercise.exercise.name,
          weight: averageWeight,
          reps: averageReps,
          time: averageTime,
          distance: averageDistance,
          targetReps: workoutExercise.targetReps,
          targetRounds: totalRounds,
          targetWeight:
            userExerciseWeight?.weight ||
            bestPerformance?.weight ||
            averageWeight,
          improvement,
          targetReached,
          nextWorkoutWeight,
          performanceByRound,
          mode: workoutExercise.exercise.mode,
        };
      })
    );

    await prisma.workoutActivity.update({
      where: { id: activityId },
      data: {
        endedAt: endTime,
      },
    });

    for (const exercise of updatedExercises) {
      for (const performance of exercise.performanceByRound) {
        const workoutActivitySet = await prisma.workoutActivitySet.upsert({
          where: {
            workoutActivityId_setNumber_roundNumber: {
              workoutActivityId: activityId,
              setNumber: 1, // Assuming one set per exercise, adjust if needed
              roundNumber: performance.round,
            },
          },
          update: {},
          create: {
            workoutActivityId: activityId,
            setNumber: 1, // Assuming one set per exercise, adjust if needed
            roundNumber: performance.round,
          },
        });

        await prisma.workoutActivityExercise.upsert({
          where: {
            workoutActivitySetId_exerciseId_roundNumber: {
              workoutActivitySetId: workoutActivitySet.id,
              exerciseId: exercise.exerciseId,
              roundNumber: performance.round,
            },
          },
          update: {
            weight: performance.weight,
            reps: performance.reps,
            time: performance.time || null,
            distance: performance.distance || null,
          },
          create: {
            workoutActivityId: activityId,
            workoutActivitySetId: workoutActivitySet.id,
            exerciseId: exercise.exerciseId,
            weight: performance.weight,
            reps: performance.reps,
            time: performance.time || null,
            distance: performance.distance || null,
            roundNumber: performance.round,
          },
        });
      }
    }

    await autoUpdateActivityCompletion(userId, "WORKOUT", workoutId);

    revalidatePath("/dashboard");
    revalidatePath("/workouts");

    redirect(`/workouts/${activityId}/summary`);
  } catch (error) {
    console.error("Error completing workout:", error);
    throw error;
  }
}

export async function updateWorkoutActivity(
  workoutActivityId: string,
  exercises: {
    id: string;
    exerciseId: string;
    weight: number;
    reps?: number;
    time?: number;
    distance?: number;
    roundNumber: number;
    mode: ExerciseMode;
  }[]
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
      throw new Error("Workout activity not found");
    }

    const { sets } = workoutActivity.workout;

    for (const exercise of exercises) {
      const set = sets.find((s) =>
        s.exercises.some((e) => e.exerciseId === exercise.exerciseId)
      );

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

        const exerciseData = {
          weight: exercise.weight,
          reps: exercise.mode === ExerciseMode.REPS ? exercise.reps : null,
          time: exercise.mode === ExerciseMode.TIME ? exercise.time : null,
          distance:
            exercise.mode === ExerciseMode.DISTANCE ? exercise.distance : null,
        };

        await prisma.workoutActivityExercise.upsert({
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
            ...exerciseData,
          },
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating workout activity:", error);
    throw error;
  }
}

export async function updateUserExerciseWeight(
  workoutActivityId: string,
  exerciseId: string,
  newWeight: number,
  userId: string
): Promise<void> {
  try {
    const workoutActivity = await prisma.workoutActivity.findUnique({
      where: { id: workoutActivityId },
      include: { workout: true },
    });

    if (!workoutActivity) {
      throw new Error("Workout activity not found");
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

    console.log("********");
    console.log("********");
    console.log("********");
    console.log("********");
    console.log("********");
    console.log({ newWeight });
    console.log("********");
    console.log("********");
    console.log("********");
    console.log("********");
    console.log("********");
  } catch (error) {
    console.error("Error updating user exercise weight:", error);
    throw error;
  }
}

export async function getUniqueBodyFocuses(): Promise<string[]> {
  const workouts = await prisma.workout.findMany({
    select: {
      muscleGroups: true,
    },
  });

  const allMuscleGroups = workouts.flatMap((workout) => workout.muscleGroups);
  const uniqueMuscleGroups = Array.from(new Set(allMuscleGroups)).sort();

  return uniqueMuscleGroups;
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
        endedAt: "desc",
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
            (setTotal, exercise) =>
              setTotal + (exercise.weight || 0) * (exercise.reps || 1),
            0
          ),
        0
      ),
    }));
  } catch (error) {
    console.error("Error fetching completed workouts:", error);
    throw error;
  }
}

export async function getWorkoutSummary(
  workoutActivityId: string
): Promise<WorkoutSummary | null> {
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
      ? (workoutActivity.endedAt.getTime() -
          workoutActivity.startedAt.getTime()) /
        1000
      : 0;

  // Group exercises by exerciseId
  const exerciseGroups = workoutActivity.sets.reduce<
    Record<string, ExerciseGroup>
  >((groups, set) => {
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
  }, {});

  const exercises: ExerciseSummary[] = await Promise.all(
    Object.entries(exerciseGroups).map(async ([exerciseId, group]) => {
      const previousPerformance =
        await prisma.workoutActivityExercise.findFirst({
          where: {
            exerciseId,
            workoutActivity: {
              userId: workoutActivity.userId,
              endedAt: { lt: workoutActivity.startedAt },
            },
          },
          orderBy: { workoutActivity: { endedAt: "desc" } },
        });

      // Get the target from the workout's exercise configuration
      const workoutExercise = workoutActivity.workout.sets
        .flatMap((s) => s.exercises)
        .find((e) => e.exerciseId === exerciseId);

      const targetReps = workoutExercise?.targetReps || 0;

      // Calculate averages across all performances
      const totalWeight = group.performances.reduce(
        (sum, p) => sum + p.weight,
        0
      );
      const totalReps = group.performances.reduce(
        (sum, p) => sum + (p.reps || 0),
        0
      );
      const totalTime = group.performances.reduce(
        (sum, p) => sum + (p.time || 0),
        0
      );
      const totalDistance = group.performances.reduce(
        (sum, p) => sum + (p.distance || 0),
        0
      );

      const averageWeight = totalWeight / group.performances.length;
      const averageReps = totalReps / group.performances.length;
      const averageTime = totalTime / group.performances.length;
      const averageDistance = totalDistance / group.performances.length;

      // Check if target is reached based on the best performance
      const bestPerformance = group.performances.reduce((best, current) => {
        switch (group.exercise.mode) {
          case "REPS":
            return (current.reps || 0) > (best.reps || 0) ? current : best;
          case "TIME":
            return (current.time || 0) > (best.time || 0) ? current : best;
          case "DISTANCE":
            return (current.distance || 0) > (best.distance || 0)
              ? current
              : best;
          default:
            return best;
        }
      }, group.performances[0]);

      const targetReached =
        group.exercise.mode === "REPS"
          ? (bestPerformance.reps || 0) >= targetReps &&
            (bestPerformance.reps || 0) > 0
          : group.exercise.mode === "TIME"
          ? (bestPerformance.time || 0) >= targetReps &&
            (bestPerformance.time || 0) > 0
          : (bestPerformance.distance || 0) >= targetReps &&
            (bestPerformance.distance || 0) > 0;

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
          targetRounds: Math.max(
            ...group.performances.map((p) => p.roundNumber)
          ),
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
              targetRounds: Math.max(
                ...group.performances.map((p) => p.roundNumber)
              ),
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
          : null
      );

      const nextWorkoutWeight = calculateNextWorkoutWeight(
        averageWeight,
        targetReached
      );

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
    })
  );

  const totalWeightLifted = exercises.reduce(
    (total, exercise) =>
      total +
      exercise.weight * exercise.reps * exercise.performanceByRound.length,
    0
  );

  const previousWorkout = await prisma.workoutActivity.findFirst({
    where: {
      workoutId: workoutActivity.workoutId,
      userId: workoutActivity.userId,
      endedAt: { lt: workoutActivity.startedAt },
    },
    orderBy: { endedAt: "desc" },
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

function calculateTotalWeightLifted(
  workoutActivity: WorkoutActivityWithSets
): number {
  return workoutActivity.sets.reduce(
    (total, set) =>
      total +
      set.exercises.reduce(
        (setTotal, exercise) =>
          setTotal + (exercise.weight || 0) * (exercise.reps || 1),
        0
      ),
    0
  );
}
