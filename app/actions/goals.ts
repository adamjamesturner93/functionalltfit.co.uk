'use server';

import { GoalPeriod, GoalType } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const MAX_ACTIVE_GOALS = 5;

const goalSchema = z.object({
  type: z.enum([
    GoalType.WEIGHT,
    GoalType.YOGA_SESSIONS,
    GoalType.WORKOUT_SESSIONS,
    GoalType.TOTAL_SESSIONS,
    GoalType.CUSTOM,
    GoalType.EXERCISE_WEIGHT,
    GoalType.EXERCISE_REPS,
    GoalType.EXERCISE_DISTANCE,
  ]),
  target: z.number().positive(),
  period: z.enum([GoalPeriod.WEEK, GoalPeriod.MONTH]).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  exerciseId: z.string().optional(),
  endDate: z.date().optional(),
});

export async function addGoal(data: z.infer<typeof goalSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  try {
    const activeGoals = await prisma.goal.count({
      where: {
        userId: session.user.id,
        isActive: true,
      },
    });

    if (activeGoals >= MAX_ACTIVE_GOALS) {
      return { error: 'Maximum number of active goals reached' };
    }

    const validatedData = goalSchema.parse(data);

    // If it's a weight goal, use the latest weight as current
    let current = 0;
    if (validatedData.type === GoalType.WEIGHT) {
      const latestMeasurement = await prisma.measurement.findFirst({
        where: { userId: session.user.id },
        orderBy: { date: 'desc' },
      });
      current = latestMeasurement?.weight || 0;
    }

    await prisma.goal.create({
      data: {
        userId: session.user.id,
        type: validatedData.type,
        target: validatedData.target,
        current,
        period: validatedData.period,
        title: validatedData.title,
        description: validatedData.description,
        exerciseId: validatedData.exerciseId,
        startDate: new Date(),
        endDate: validatedData.endDate,
      },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error adding goal:', error);
    return { error: 'Failed to add goal' };
  }
}

export async function getActiveGoals(userId: string) {
  return prisma.goal.findMany({
    where: {
      userId,
      isActive: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getAllGoals(userId: string) {
  return prisma.goal.findMany({
    where: {
      userId,
    },
    orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
  });
}

export async function updateGoalProgress(goalId: string, current: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  try {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal) {
      return { error: 'Goal not found' };
    }

    const updatedGoal = await prisma.goal.update({
      where: {
        id: goalId,
        userId: session.user.id,
      },
      data: {
        current,
        isActive: current < goal.target,
        endDate: current >= goal.target ? new Date() : goal.endDate,
      },
    });

    return { success: true, goal: updatedGoal };
  } catch (error) {
    console.error('Error updating goal progress:', error);
    return { error: 'Failed to update goal progress' };
  }
}

export async function deleteGoal(goalId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  try {
    await prisma.goal.delete({
      where: {
        id: goalId,
        userId: session.user.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting goal:', error);
    return { error: 'Failed to delete goal' };
  }
}

export async function updateGoalsProgress(userId: string) {
  const activeGoals = await prisma.goal.findMany({
    where: {
      userId,
      isActive: true,
    },
  });

  for (const goal of activeGoals) {
    let current = 0;

    switch (goal.type) {
      case GoalType.YOGA_SESSIONS:
      case GoalType.WORKOUT_SESSIONS:
      case GoalType.TOTAL_SESSIONS:
        const startDate =
          goal.period === GoalPeriod.WEEK
            ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const sessionCount = await prisma.programmeActivity.count({
          where: {
            programme: {
              userProgrammes: {
                some: {
                  userId: userId,
                  isActive: true,
                },
              },
            },
            completed: true,
            week: {
              gte:
                Math.floor(
                  (new Date().getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
                ) + 1,
            },
            ...(goal.type !== GoalType.TOTAL_SESSIONS && {
              activityType: goal.type === GoalType.YOGA_SESSIONS ? 'YOGA' : 'WORKOUT',
            }),
          },
        });
        current = sessionCount;
        break;

      case GoalType.WEIGHT:
        const latestMeasurement = await prisma.measurement.findFirst({
          where: { userId },
          orderBy: { date: 'desc' },
        });
        current = latestMeasurement?.weight || 0;
        break;

      case GoalType.EXERCISE_WEIGHT:
      case GoalType.EXERCISE_REPS:
      case GoalType.EXERCISE_DISTANCE:
        if (!goal.exerciseId) {
          console.error(`Exercise ID not set for goal ${goal.id}`);
          continue;
        }

        const latestWorkoutActivity = await prisma.workoutActivity.findFirst({
          where: { userId },
          orderBy: { endedAt: 'desc' },
          include: {
            WorkoutActivityExercise: {
              where: { exerciseId: goal.exerciseId },
              orderBy: { roundNumber: 'desc' },
              take: 1,
            },
          },
        });

        if (latestWorkoutActivity && latestWorkoutActivity.WorkoutActivityExercise[0]) {
          const exercisePerformance = latestWorkoutActivity.WorkoutActivityExercise[0];
          switch (goal.type) {
            case GoalType.EXERCISE_WEIGHT:
              current = exercisePerformance.weight;
              break;
            case GoalType.EXERCISE_REPS:
              current = exercisePerformance.reps || 0;
              break;
            case GoalType.EXERCISE_DISTANCE:
              current = exercisePerformance.distance || 0;
              break;
          }
        }
        break;

      case GoalType.CUSTOM:
        // For custom goals, we don't automatically update progress
        // The user or the application logic should manually update these goals
        continue;

      default:
        console.error(`Unsupported goal type: ${goal.type}`);
        continue;
    }

    await prisma.goal.update({
      where: { id: goal.id },
      data: {
        current,
        isActive: current < goal.target,
        endDate: current >= goal.target ? new Date() : goal.endDate,
      },
    });
  }

  return { success: true };
}
export async function markGoalComplete(goalId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  try {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId, userId: session.user.id },
    });

    if (!goal) {
      return { error: 'Goal not found' };
    }

    const updatedGoal = await prisma.goal.update({
      where: {
        id: goalId,
        userId: session.user.id,
      },
      data: {
        current: goal.target,
        isActive: false,
        endDate: new Date(),
      },
    });

    return { success: true, goal: updatedGoal };
  } catch (error) {
    console.error('Error marking goal as complete:', error);
    return { error: 'Failed to mark goal as complete' };
  }
}

export async function markGoalInactive(goalId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  try {
    const updatedGoal = await prisma.goal.update({
      where: {
        id: goalId,
        userId: session.user.id,
      },
      data: {
        isActive: false,
      },
    });

    return { success: true, goal: updatedGoal };
  } catch (error) {
    console.error('Error marking goal as inactive:', error);
    return { error: 'Failed to mark goal as inactive' };
  }
}

export async function getGoalProgress(goalId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  try {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId, userId: session.user.id },
    });

    if (!goal) {
      return { error: 'Goal not found' };
    }

    let current = 0;

    switch (goal.type) {
      case GoalType.YOGA_SESSIONS:
      case GoalType.WORKOUT_SESSIONS:
      case GoalType.TOTAL_SESSIONS:
        const startDate =
          goal.period === GoalPeriod.WEEK
            ? new Date(new Date().setHours(0, 0, 0, 0) - new Date().getDay() * 24 * 60 * 60 * 1000)
            : new Date(new Date().setDate(1)); // First day of current month

        const sessionCount = await prisma.programmeActivity.count({
          where: {
            programme: {
              userProgrammes: {
                some: {
                  userId: session.user.id,
                  isActive: true,
                },
              },
            },
            completed: true,
            completedAt: {
              gte: startDate,
            },
            ...(goal.type !== GoalType.TOTAL_SESSIONS && {
              activityType: goal.type === GoalType.YOGA_SESSIONS ? 'YOGA' : 'WORKOUT',
            }),
          },
        });

        current = sessionCount;
        break;

      case GoalType.WEIGHT:
        const latestMeasurement = await prisma.measurement.findFirst({
          where: { userId: session.user.id },
          orderBy: { date: 'desc' },
        });
        current = latestMeasurement?.weight || 0;
        break;

      case GoalType.EXERCISE_WEIGHT:
      case GoalType.EXERCISE_REPS:
      case GoalType.EXERCISE_DISTANCE:
        if (!goal.exerciseId) {
          return { error: 'Exercise ID not set for this goal' };
        }

        const latestWorkoutActivity = await prisma.workoutActivity.findFirst({
          where: { userId: session.user.id },
          orderBy: { endedAt: 'desc' },
          include: {
            WorkoutActivityExercise: {
              where: { exerciseId: goal.exerciseId },
              orderBy: { roundNumber: 'desc' },
              take: 1,
            },
          },
        });

        if (latestWorkoutActivity && latestWorkoutActivity.WorkoutActivityExercise[0]) {
          const exercisePerformance = latestWorkoutActivity.WorkoutActivityExercise[0];
          switch (goal.type) {
            case GoalType.EXERCISE_WEIGHT:
              current = exercisePerformance.weight;
              break;
            case GoalType.EXERCISE_REPS:
              current = exercisePerformance.reps || 0;
              break;
            case GoalType.EXERCISE_DISTANCE:
              current = exercisePerformance.distance || 0;
              break;
          }
        }
        break;

      case GoalType.CUSTOM:
        current = goal.current;
        break;

      default:
        return { error: 'Unsupported goal type' };
    }

    const progress = (current / goal.target) * 100;
    const isCompleted = current >= goal.target;

    return {
      success: true,
      goal: {
        ...goal,
        current,
        progress,
        isCompleted,
      },
    };
  } catch (error) {
    console.error('Error getting goal progress:', error);
    return { error: 'Failed to get goal progress' };
  }
}
