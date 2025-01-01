'use client';

import { useCallback, useEffect, useState } from 'react';
import { ExerciseMode, Unit } from '@prisma/client';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { getCurrentUser } from '@/app/actions/profile';
import { completeWorkout, startWorkout, updateWorkoutActivity } from '@/app/actions/workouts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUserId } from '@/lib/auth-utils';

import { SetRest } from './set-rest';
import { WorkoutCompletionLoading } from './workout-completion-loading';
import { WorkoutExercise } from './workout-exercise';
import { WorkoutPhaseMessage } from './workout-phase-message';
import { WorkoutProgress } from './workout-progress';

interface Workout {
  id: string;
  workoutId: string;
  name: string;
  warmup: Exercise[];
  sets: {
    id: string;
    type: string;
    rounds: number;
    rest: number;
    gap?: number;
    exercises: Exercise[];
  }[];
  cooldown: Exercise[];
}

interface Exercise {
  id: string;
  exerciseId: string;
  name: string;
  mode: ExerciseMode;
  weight: number;
  reps: number;
  time?: number;
  distance?: number;
  targetReps: number;
  targetTime?: number;
  targetDistance?: number;
  equipment: string[];
  instructions: string;
  videoUrl: string;
  thumbnailUrl: string;
  previousPerformance?: {
    weight?: number;
    reps?: number;
    time?: number;
    distance?: number;
  } | null;
}

export default function WorkoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [workoutActivityId, setWorkoutActivityId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'warmup' | 'main' | 'cooldown' | 'complete'>(
    'warmup',
  );
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isGap, setIsGap] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<{ weightUnit: Unit; lengthUnit: Unit }>({
    weightUnit: Unit.METRIC,
    lengthUnit: Unit.METRIC,
  });

  useEffect(() => {
    const begin = async () => {
      try {
        setIsLoading(true);
        const currentUserId = await getCurrentUserId();
        setUserId(currentUserId);
        if (!currentUserId) {
          throw new Error('User not authenticated');
        }
        const user = await getCurrentUser();
        setUserPreferences({
          weightUnit: user?.preferences?.weightUnit || Unit.METRIC,
          lengthUnit: user?.preferences?.lengthUnit || Unit.METRIC,
        });
        const combinedWorkout = await startWorkout(id as string, currentUserId);
        setWorkout(combinedWorkout as unknown as Workout);
        setWorkoutActivityId(combinedWorkout.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    begin();
  }, [id]);

  const handleUpdateExercise = async (
    exerciseId: string,
    performance: {
      weight?: number;
      reps?: number;
      time?: number;
      distance?: number;
    },
  ) => {
    if (!workout || !workoutActivityId) return;

    let updatedWorkout: Workout;

    if (currentPhase === 'warmup') {
      updatedWorkout = {
        ...workout,
        warmup: workout.warmup.map((exercise) =>
          exercise.id === exerciseId ? { ...exercise, ...performance } : exercise,
        ),
      };
    } else if (currentPhase === 'cooldown') {
      updatedWorkout = {
        ...workout,
        cooldown: workout.cooldown.map((exercise) =>
          exercise.id === exerciseId ? { ...exercise, ...performance } : exercise,
        ),
      };
    } else {
      updatedWorkout = {
        ...workout,
        sets: workout.sets.map((set) => ({
          ...set,
          exercises: set.exercises.map((exercise) =>
            exercise.id === exerciseId ? { ...exercise, ...performance } : exercise,
          ),
        })),
      };
    }

    setWorkout(updatedWorkout);

    try {
      const result = await updateWorkoutActivity(workoutActivityId, [
        {
          id: exerciseId,
          exerciseId,
          ...performance,
          roundNumber: currentPhase === 'main' ? currentRoundIndex + 1 : 1,
          mode:
            currentPhase === 'main'
              ? workout.sets[currentSetIndex].exercises.find((e) => e.id === exerciseId)?.mode ||
                ExerciseMode.REPS
              : ExerciseMode.TIME,
        },
      ]);

      if (result.error) {
        throw new Error(result.error);
      }

      if (currentPhase === 'main') {
        const currentSet = workout.sets[currentSetIndex];
        if (currentSet.gap && currentExerciseIndex < currentSet.exercises.length - 1) {
          setIsGap(true);
          setTimeLeft(currentSet.gap);
        } else {
          moveToNextExercise();
        }
      } else {
        moveToNextExercise();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while updating the exercise',
      );
    }
  };

  const moveToNextExercise = useCallback(() => {
    if (!workout) return;

    if (currentPhase === 'warmup') {
      if (currentExerciseIndex < workout.warmup.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      } else {
        setCurrentPhase('main');
        setCurrentExerciseIndex(0);
        setCurrentSetIndex(0);
        setCurrentRoundIndex(0);
      }
    } else if (currentPhase === 'main') {
      const currentSet = workout.sets[currentSetIndex];
      if (currentExerciseIndex < currentSet.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      } else if (currentRoundIndex < currentSet.rounds - 1) {
        setCurrentRoundIndex(currentRoundIndex + 1);
        setCurrentExerciseIndex(0);
        setIsResting(true);
        setTimeLeft(currentSet.rest);
      } else if (currentSetIndex < workout.sets.length - 1) {
        setCurrentSetIndex(currentSetIndex + 1);
        setCurrentExerciseIndex(0);
        setCurrentRoundIndex(0);
        setIsResting(true);
        setTimeLeft(workout.sets[currentSetIndex + 1].rest);
      } else {
        setCurrentPhase('cooldown');
        setCurrentExerciseIndex(0);
      }
    } else if (currentPhase === 'cooldown') {
      if (currentExerciseIndex < workout.cooldown.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      } else {
        setCurrentPhase('complete');
      }
    }
  }, [workout, currentPhase, currentExerciseIndex, currentSetIndex, currentRoundIndex]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if ((isResting || isGap) && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if ((isResting || isGap) && timeLeft === 0) {
      setIsResting(false);
      setIsGap(false);
      moveToNextExercise();
    }
    return () => clearTimeout(timer);
  }, [isResting, isGap, timeLeft, moveToNextExercise]);

  useEffect(() => {
    if (currentPhase === 'complete' && workout && workoutActivityId && userId) {
      const finishWorkout = async () => {
        try {
          setIsLoading(true);
          const result = await completeWorkout(workoutActivityId, workout.workoutId, userId);
          if (result.success) {
            router.push(result.redirectUrl);
          } else {
            throw new Error('Failed to complete workout');
          }
        } catch (err) {
          console.error('Error completing workout:', err);
          setError(
            err instanceof Error ? err.message : 'An error occurred while completing the workout',
          );
          toast({
            title: 'Error',
            description: 'Failed to complete the workout. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };
      finishWorkout();
    }
  }, [currentPhase, workout, workoutActivityId, userId, router, toast]);

  if (isLoading) {
    if (currentPhase === 'complete') {
      return <WorkoutCompletionLoading />;
    } else {
      return <div>Loading...</div>;
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!workout) {
    return <div>No workout found</div>;
  }

  const currentExercise =
    currentPhase === 'warmup'
      ? workout.warmup[currentExerciseIndex]
      : currentPhase === 'cooldown'
        ? workout.cooldown[currentExerciseIndex]
        : workout.sets[currentSetIndex].exercises[currentExerciseIndex];

  const progress =
    ((currentPhase === 'warmup'
      ? currentExerciseIndex
      : currentPhase === 'cooldown'
        ? workout.warmup.length +
          workout.sets.reduce((acc, set) => acc + set.exercises.length * set.rounds, 0) +
          currentExerciseIndex
        : workout.warmup.length +
          workout.sets
            .slice(0, currentSetIndex)
            .reduce((acc, set) => acc + set.exercises.length * set.rounds, 0) +
          currentRoundIndex * workout.sets[currentSetIndex].exercises.length +
          currentExerciseIndex) /
      (workout.warmup.length +
        workout.sets.reduce((acc, set) => acc + set.exercises.length * set.rounds, 0) +
        workout.cooldown.length)) *
    100;

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/workouts/${workout.workoutId}`}
          className="flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Workout
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <WorkoutProgress
            workoutName={workout.name}
            progress={progress}
            currentPhase={currentPhase}
            currentSet={currentPhase === 'main' ? workout.sets[currentSetIndex] : undefined}
            currentRoundIndex={currentRoundIndex}
            currentExerciseIndex={currentExerciseIndex}
          />

          <WorkoutPhaseMessage
            currentPhase={currentPhase}
            isLastExercise={
              currentPhase === 'warmup'
                ? currentExerciseIndex === workout.warmup.length - 1
                : currentPhase === 'cooldown'
                  ? currentExerciseIndex === workout.cooldown.length - 1
                  : false
            }
          />

          {isResting && (
            <SetRest
              restTime={timeLeft}
              nextSetEquipment={
                currentSetIndex < workout.sets.length - 1
                  ? workout.sets[currentSetIndex + 1].exercises.flatMap((e) => e.equipment)
                  : []
              }
              onSkipRest={() => {
                setIsResting(false);
                moveToNextExercise();
              }}
            />
          )}

          {!isResting && !isGap && currentExercise && (
            <WorkoutExercise
              exercise={currentExercise}
              currentRound={currentRoundIndex + 1}
              totalRounds={currentPhase === 'main' ? workout.sets[currentSetIndex].rounds : 1}
              onComplete={handleUpdateExercise}
              userPreferences={userPreferences}
              isWarmupOrCooldown={currentPhase === 'warmup' || currentPhase === 'cooldown'}
            />
          )}

          {isGap && (
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-2 text-xl font-semibold">Rest between exercises</h3>
                <p className="text-3xl font-bold">{timeLeft}s</p>
                <Button
                  onClick={() => {
                    setIsGap(false);
                    moveToNextExercise();
                  }}
                  className="mt-4"
                >
                  Skip Rest
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
