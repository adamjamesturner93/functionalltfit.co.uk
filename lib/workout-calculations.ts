import { ExerciseSummary } from '@/app/actions/workouts';
import { ExerciseMode } from '@prisma/client';

export function calculateImprovements(
  currentPerformance: ExerciseSummary,
  previousPerformance: ExerciseSummary | null,
): ExerciseSummary['improvement'] {
  if (!previousPerformance) {
    return {
      reps: 0,
      weight: 0,
      time: 0,
      distance: 0,
      totalWeight: 0,
    };
  }

  const improvement = {
    reps: currentPerformance.reps - previousPerformance.reps,
    weight: currentPerformance.weight - previousPerformance.weight,
    time: (currentPerformance.time || 0) - (previousPerformance.time || 0),
    distance: (currentPerformance.distance || 0) - (previousPerformance.distance || 0),
    totalWeight: 0,
  };

  improvement.totalWeight =
    currentPerformance.weight * currentPerformance.reps -
    previousPerformance.weight * previousPerformance.reps;

  return improvement;
}

export function calculateNextWorkoutWeight(currentWeight: number, targetReached: boolean): number {
  if (targetReached) {
    return Math.ceil((currentWeight * 1.05) / 2.5) * 2.5;
  }
  return currentWeight;
}

export function isPersonalBest(
  currentPerformance: ExerciseSummary,
  previousBest: ExerciseSummary | null,
): boolean {
  if (!previousBest) return true;

  switch (currentPerformance.mode) {
    case ExerciseMode.REPS:
      return currentPerformance.reps > previousBest.reps;
    case ExerciseMode.TIME:
      return (currentPerformance.time || 0) > (previousBest.time || 0);
    case ExerciseMode.DISTANCE:
      return (currentPerformance.distance || 0) > (previousBest.distance || 0);
    default:
      return false;
  }
}
