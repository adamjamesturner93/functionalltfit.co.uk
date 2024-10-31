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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

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

  if (filters.minDuration) {
    where.totalLength = { gte: filters.minDuration * 60 };
  }

  if (filters.maxDuration) {
    where.totalLength = { ...where.totalLength, lte: filters.maxDuration * 60 };
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

type ExerciseInSet = Prisma.SetExerciseGetPayload<{
  include: {
    exercise: true;
  };
}>;

type WorkoutActivityExercise = Prisma.WorkoutActivityExerciseGetPayload<object>;

export async function startWorkout(workoutId: string, userId: string) {
  try {
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
            exercises: true,
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
        const setExercises = set.exercises.map(
          (exerciseInSet: ExerciseInSet) => {
            const userWeight = userExerciseWeights.find(
              (uw) => uw.exerciseId === exerciseInSet.exercise.id
            );
            const previousExercise = previousWorkoutActivity?.sets
              .flatMap((set) => set.exercises)
              .find(
                (wae: WorkoutActivityExercise) =>
                  wae.exerciseId === exerciseInSet.exercise.id
              );

            let weight: number;
            if (userWeight) {
              weight = userWeight.weight;
            } else if (previousExercise) {
              weight = previousExercise.weight;
            } else {
              weight = 0; // Default weight if not found
            }

            let reps: number | undefined,
              time: number | undefined,
              distance: number | undefined,
              targetReps: number | undefined,
              targetTime: number | undefined,
              targetDistance: number | undefined;

            switch (exerciseInSet.exercise.mode) {
              case ExerciseMode.REPS:
                targetReps = exerciseInSet.targetReps;
                reps = previousExercise?.reps || Math.floor(targetReps * 0.8);
                break;
              case ExerciseMode.TIME:
                targetTime = exerciseInSet.targetReps; // Assuming targetReps is used for time in seconds
                time = previousExercise?.time || Math.floor(targetTime * 0.8);
                break;
              case ExerciseMode.DISTANCE:
                targetDistance = exerciseInSet.targetReps; // Assuming targetReps is used for distance in meters
                distance =
                  previousExercise?.distance ||
                  Math.floor(targetDistance * 0.8);
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
              reps,
              time,
              distance,
              previousWeight: previousExercise?.weight || null,
              previousReps: previousExercise?.reps || null,
              previousTime: previousExercise?.time || null,
              previousDistance: previousExercise?.distance || null,
              equipment: exerciseInSet.exercise.equipment,
              muscleGroups: exerciseInSet.exercise.muscleGroups,
              type: exerciseInSet.exercise.type,
              thumbnailUrl: exerciseInSet.exercise.thumbnailUrl,
              videoUrl: exerciseInSet.exercise.videoUrl,
              mode: exerciseInSet.exercise.mode,
              instructions: exerciseInSet.exercise.instructions,
            };
          }
        );

        // Create a unique, alphabetically sorted array of equipment for the set
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
    weight: number;
    reps: number;
    time?: number;
    distance?: number;
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
    const updatedExercises = await Promise.all(
      exercises.map(async (exercise) => {
        const previousPerformance = previousActivity?.sets
          .flatMap((set) => set.exercises)
          .find((e) => e.exerciseId === exercise.exerciseId);

        const workoutExercise = workoutActivity.workout.sets
          .flatMap((set) => set.exercises)
          .find((e) => e.exerciseId === exercise.exerciseId);

        if (!workoutExercise) {
          throw new Error(
            `Exercise with id ${exercise.exerciseId} not found in workout`
          );
        }

        const exerciseWeight = exercise.weight * exercise.reps;
        totalWeightLifted += exerciseWeight;

        const userExerciseWeight = await prisma.userExerciseWeight.findUnique({
          where: {
            userId_workoutId_exerciseId: {
              userId,
              workoutId,
              exerciseId: exercise.exerciseId,
            },
          },
        });

        const targetReached =
          workoutExercise.exercise.mode === ExerciseMode.REPS
            ? exercise.reps >= workoutExercise.targetReps
            : workoutExercise.exercise.mode === ExerciseMode.TIME
            ? (exercise.time || 0) >= workoutExercise.targetReps
            : workoutExercise.exercise.mode === ExerciseMode.DISTANCE
            ? (exercise.distance || 0) >= workoutExercise.targetReps
            : false;

        const nextWorkoutWeight = targetReached
          ? Math.ceil(
              ((userExerciseWeight?.weight || exercise.weight) * 1.05) / 2.5
            ) * 2.5
          : userExerciseWeight?.weight || exercise.weight;

        return {
          id: exercise.id,
          exerciseId: exercise.exerciseId,
          name: workoutExercise.exercise.name,
          weight: exercise.weight,
          reps: exercise.reps,
          targetReps: workoutExercise.targetReps,
          targetRounds:
            workoutActivity.workout.sets.find((set) =>
              set.exercises.some((e) => e.exerciseId === exercise.exerciseId)
            )?.rounds || 1,
          targetWeight:
            userExerciseWeight?.weight ||
            previousPerformance?.weight ||
            exercise.weight,
          time: exercise.time,
          distance: exercise.distance,
          improvement: {
            reps:
              previousPerformance?.reps != null
                ? exercise.reps - previousPerformance.reps
                : 0,
            weight:
              previousPerformance?.weight != null
                ? exercise.weight - previousPerformance.weight
                : 0,
            time:
              previousPerformance?.time != null && exercise.time != null
                ? exercise.time - previousPerformance.time
                : 0,
            distance:
              previousPerformance?.distance != null && exercise.distance != null
                ? exercise.distance - previousPerformance.distance
                : 0,
            totalWeight:
              exerciseWeight -
              (previousPerformance?.reps != null &&
              previousPerformance?.weight != null
                ? previousPerformance.reps * previousPerformance.weight
                : 0),
          },
          targetReached,
          nextWorkoutWeight,
        };
      })
    );

    await prisma.workoutActivity.update({
      where: { id: activityId },
      data: {
        endedAt: endTime,
      },
    });

    for (const [setIndex, set] of workoutActivity.workout.sets.entries()) {
      const workoutActivitySet = await prisma.workoutActivitySet.upsert({
        where: {
          workoutActivityId_setNumber: {
            workoutActivityId: activityId,
            setNumber: setIndex + 1,
          },
        },
        update: {},
        create: {
          workoutActivityId: activityId,
          setNumber: setIndex + 1,
          roundNumber: 1,
        },
      });

      for (const setExercise of set.exercises) {
        const updatedExercise = updatedExercises.find(
          (e) => e.exerciseId === setExercise.exerciseId
        );

        if (updatedExercise) {
          await prisma.workoutActivityExercise.upsert({
            where: {
              workoutActivitySetId_exerciseId: {
                workoutActivitySetId: workoutActivitySet.id,
                exerciseId: setExercise.exerciseId,
              },
            },
            update: {
              weight: updatedExercise.weight,
              reps: updatedExercise.reps,
              time: updatedExercise.time,
              distance: updatedExercise.distance,
            },
            create: {
              workoutActivityId: activityId,
              workoutActivitySetId: workoutActivitySet.id,
              exerciseId: setExercise.exerciseId,
              weight: updatedExercise.weight,
              reps: updatedExercise.reps,
              time: updatedExercise.time,
              distance: updatedExercise.distance,
            },
          });
        }
      }
    }

    return {
      summary: {
        totalDuration,
        totalWeightLifted,
        exercises: updatedExercises,
      },
    };
  } catch (error) {
    console.error("Error completing workout:", error);
    throw error;
  }
}

export async function updateWorkoutActivity(
  activityId: string,
  exercises: {
    id: string;
    exerciseId: string;
    weight: number;
    reps: number;
    time?: number;
    distance?: number;
  }[]
) {
  try {
    const workoutActivity = await prisma.workoutActivity.findUnique({
      where: { id: activityId },
      include: { sets: true },
    });

    if (!workoutActivity) {
      throw new Error("Workout activity not found");
    }

    if (workoutActivity.sets.length === 0) {
      // Create sets and exercises if they don't exist
      await prisma.workoutActivity.update({
        where: { id: activityId },
        data: {
          sets: {
            create: [
              {
                setNumber: 1,
                roundNumber: 1,
                exercises: {
                  create: exercises.map((exercise) => ({
                    exerciseId: exercise.exerciseId,
                    weight: exercise.weight,
                    reps: exercise.reps,
                    time: exercise.time,
                    distance: exercise.distance,
                    workoutActivityId: activityId,
                  })),
                },
              },
            ],
          },
        },
      });
    } else {
      // Update existing exercises
      await prisma.workoutActivity.update({
        where: { id: activityId },
        data: {
          sets: {
            update: workoutActivity.sets.map((set) => ({
              where: { id: set.id },
              data: {
                exercises: {
                  upsert: exercises.map((exercise) => ({
                    where: {
                      workoutActivitySetId_exerciseId: {
                        workoutActivitySetId: set.id,
                        exerciseId: exercise.exerciseId,
                      },
                    },
                    create: {
                      exerciseId: exercise.exerciseId,
                      weight: exercise.weight,
                      reps: exercise.reps,
                      time: exercise.time,
                      distance: exercise.distance,
                      workoutActivityId: activityId,
                    },
                    update: {
                      weight: exercise.weight,
                      reps: exercise.reps,
                      time: exercise.time,
                      distance: exercise.distance,
                    },
                  })),
                },
              },
            })),
          },
        },
      });
    }

    const updatedWorkoutActivity = await prisma.workoutActivity.findUnique({
      where: { id: activityId },
      include: {
        sets: {
          include: {
            exercises: {
              include: { exercise: true },
            },
          },
        },
      },
    });

    return updatedWorkoutActivity;
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
    // First, ensure the user, workout, and exercise exist
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

    // Now, upsert the UserExerciseWeight
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
