import { Unit } from '@prisma/client';
import { ChevronRight, TrendingUp, Trophy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPerformance } from '@/lib/utils';

interface ExerciseCardProps {
  exercise: {
    id: string;
    exerciseId: string;
    name: string;
    mode: string;
    weight: number;
    reps: number;
    time?: number;
    distance?: number;
    targetReps?: number;
    targetTime?: number;
    targetDistance?: number;
    targetReached: boolean;
    improvement: {
      reps: number;
      weight: number;
      time: number;
      distance: number;
    };
    nextWorkoutWeight: number;
    performanceByRound: {
      round: number;
      weight: number;
      reps: number;
      time?: number;
      distance?: number;
    }[];
  };
  userPreferences: {
    weightUnit: Unit;
    lengthUnit: Unit;
  };
  onIncreaseWeight: (exerciseId: string, currentWeight: number) => void;
  isWeightIncreased: boolean;
}

export function ExerciseCard({
  exercise,
  userPreferences,
  onIncreaseWeight,
  isWeightIncreased,
}: ExerciseCardProps) {
  const hasImprovement = Object.values(exercise.improvement).some((value) => value > 0);

  const getPerformanceValue = (round: { reps?: number; time?: number; distance?: number }) => {
    switch (exercise.mode.toLowerCase()) {
      case 'reps':
        return round.reps;
      case 'time':
        return round.time;
      case 'distance':
        return round.distance;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden border-slate-700 bg-slate-800/50">
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{exercise.name}</h4>
              {exercise.targetReached && <Trophy className="size-4 text-yellow-500" />}
              {hasImprovement && <TrendingUp className="size-4 text-green-500" />}
            </div>
            <p className="text-sm text-slate-400">
              Target:{' '}
              {formatPerformance(
                exercise.targetReps || exercise.targetTime || exercise.targetDistance,
                exercise.mode,
                exercise.mode === 'DISTANCE' ? 'm' : '',
              )}
            </p>
          </div>
          {exercise.mode === 'REPS' &&
            exercise.targetReached &&
            (isWeightIncreased ? (
              <p className="text-sm text-indigo-400">
                Weight increased to{' '}
                {formatPerformance(
                  exercise.nextWorkoutWeight,
                  'weight',
                  userPreferences.weightUnit === 'IMPERIAL' ? 'lbs' : 'kg',
                )}
              </p>
            ) : (
              <Button
                onClick={() => onIncreaseWeight(exercise.exerciseId, exercise.weight)}
                className="bg-indigo-600 hover:bg-indigo-700"
                size="sm"
              >
                Increase weight
                <ChevronRight className="ml-2 size-4" />
              </Button>
            ))}
        </div>

        <div className="space-y-2">
          {exercise.performanceByRound.map((round) => (
            <div
              key={round.round}
              className="flex items-center justify-between rounded-lg bg-slate-800/50 p-2 text-sm"
            >
              <span className="text-slate-400">Round {round.round}</span>
              <div className="space-x-2">
                <span>
                  {formatPerformance(
                    round.weight,
                    'weight',
                    userPreferences.weightUnit === 'IMPERIAL' ? 'lbs' : 'kg',
                  )}{' '}
                  ×{' '}
                  {formatPerformance(
                    getPerformanceValue(round),
                    exercise.mode,
                    exercise.mode === 'DISTANCE' ? 'm' : '',
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
