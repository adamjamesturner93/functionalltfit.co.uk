"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Workout, SetType, Prisma, ExerciseMode } from "@prisma/client";

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
  filters: WorkoutFilters = {}
): Promise<{ workouts: WorkoutWithCount[]; total: number }> {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

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

  const [workouts, total] = await Promise.all([
    prisma.workout.findMany({
      where,
      skip,
      take,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { WorkoutActivity: true },
        },
      },
    }),
    prisma.workout.count({ where }),
  ]);

  return { workouts, total };
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
    // First, verify that the user exists
    console.log("*********");
    console.log("*********");
    console.log("*********");
    console.log("*********");
    console.log("*********");
    console.log("*********");
    console.log("*********");
    console.log({ userId });
    console.log("*********");
    console.log("*********");
    console.log("*********");
    console.log("*********");
    console.log("*********");
    console.log("*********");
    console.log("*********");
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

    const previousActivity = await prisma.workoutActivity.findFirst({
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

    const startTime = workoutActivity.startedAt;
    const endTime = new Date();
    const totalDuration = (endTime.getTime() - startTime.getTime()) / 1000; // in seconds

    let totalWeightLifted = 0;
    let previousTotalWeightLifted = 0;
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

        const previousPerformance = previousActivity?.sets
          .flatMap((set) => set.exercises)
          .find((e) => e.exerciseId === exercise.exerciseId);

        if (previousPerformance?.reps) {
          previousTotalWeightLifted +=
            previousPerformance.weight * previousPerformance.reps;
        }

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
            previousPerformance?.weight ||
            averageWeight,
          improvement: {
            reps: previousPerformance?.reps
              ? averageReps - previousPerformance.reps
              : 0,
            weight: previousPerformance
              ? averageWeight - previousPerformance.weight
              : 0,
            time: previousPerformance
              ? averageTime - (previousPerformance.time || 0)
              : 0,
            distance: previousPerformance
              ? averageDistance - (previousPerformance.distance || 0)
              : 0,
            totalWeight:
              totalWeightLifted -
              (previousPerformance?.reps
                ? previousPerformance.weight * previousPerformance.reps
                : 0),
          },
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

    const weightLiftedImprovement =
      previousTotalWeightLifted > 0
        ? ((totalWeightLifted - previousTotalWeightLifted) /
            previousTotalWeightLifted) *
          100
        : null;

    return {
      summary: {
        totalDuration,
        totalWeightLifted,
        exercisesCompleted: updatedExercises.length,
        weightLiftedImprovement,
        exercises: updatedExercises,
      },
    };
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
  workoutId: string,
  exerciseId: string,
  newWeight: number,
  userId: string
) {
  try {
    const [user, workout, exercise] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.workout.findUnique({ where: { id: workoutId } }),
      prisma.exercise.findUnique({ where: { id: exerciseId } }),
    ]);

    if (!user) {
      console.error(`User with id ${userId} not found`);
      throw new Error("User not found");
    }
    if (!workout) {
      console.error(`Workout with id ${workoutId} not found`);
      throw new Error("Workout not found");
    }
    if (!exercise) {
      console.error(`Exercise with id ${exerciseId} not found`);
      throw new Error("Exercise not found");
    }

    const updatedWeight = await prisma.userExerciseWeight.upsert({
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

    console.log(
      `Updated weight for user ${userId}, workout ${workoutId}, exercise ${exerciseId} to ${newWeight}`
    );
    return updatedWeight;
  } catch (error) {
    console.error("Error updating user exercise weight:", error);
    throw error;
  }
}
