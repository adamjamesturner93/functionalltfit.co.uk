'use client';

import { useCallback, useEffect, useState } from 'react';
import { ExerciseMode, Unit } from '@prisma/client';
import { Clock } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { getCurrentUser } from '@/app/actions/profile';
import { completeWorkout, startWorkout, updateWorkoutActivity } from '@/app/actions/workouts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getCurrentUserId } from '@/lib/auth-utils';

import { SetRest } from './set-rest';
import { WorkoutExercise } from './workout-exercise';
import { WorkoutProgress } from './workout-progress';

interface Exercise {
  id: string;
  exerciseId: string;
  name: string;
  mode: ExerciseMode;
  weight: number;
  reps: number;
  time?: number;
  distance?: number;
  equipment: string;
  targetReps: number;
  targetTime?: number;
  targetDistance?: number;
  instructions: string;
  videoUrl: string;
  thumbnailUrl: string;
}

interface Set {
  type: string;
  rounds: number;
  rest: number;
  gap: number;
  exercises: Exercise[];
}

interface Workout {
  id: string;
  workoutId: string;
  name: string;
  sets: Set[];
}

interface ExercisePerformance {
  id: string;
  exerciseId: string;
  weight: { [roundNumber: number]: number };
  reps?: { [roundNumber: number]: number };
  time?: { [roundNumber: number]: number };
  distance?: { [roundNumber: number]: number };
}

export default function WorkoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isGap, setIsGap] = useState(false);
  const [isSetRest, setIsSetRest] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<{
    weightUnit: Unit;
    lengthUnit: Unit;
  }>({
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
          weightUnit: user?.weightUnit || Unit.METRIC,
          lengthUnit: user?.lengthUnit || Unit.METRIC,
        });
        const combinedWorkout = await startWorkout(id as string, currentUserId);
        setWorkout(combinedWorkout as unknown as Workout);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    begin();
  }, [id]);

  const handleComplete = useCallback(async () => {
    if (!workout || !userId) return;

    try {
      setIsLoading(true);
      const exercises: ExercisePerformance[] = workout.sets.flatMap((set) =>
        set.exercises.map((exercise) => {
          const exerciseData: ExercisePerformance = {
            id: exercise.id,
            exerciseId: exercise.exerciseId,
            weight: {},
            reps: {},
            time: {},
            distance: {},
          };

          for (let round = 1; round <= set.rounds; round++) {
            exerciseData.weight[round] = exercise.weight;
            if (exercise.mode === ExerciseMode.REPS) {
              exerciseData.reps![round] = exercise.reps;
            } else if (exercise.mode === ExerciseMode.TIME) {
              exerciseData.time![round] = exercise.time || 0;
            } else if (exercise.mode === ExerciseMode.DISTANCE) {
              exerciseData.distance![round] = exercise.distance || 0;
            }
          }

          return exerciseData;
        }),
      );

      await completeWorkout(workout.id, workout.workoutId, exercises, userId);
      router.push('/workouts');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while completing the workout',
      );
    } finally {
      setIsLoading(false);
    }
  }, [workout, userId, router]);

  const startSetRest = useCallback(() => {
    if (!workout) return;
    if (currentSetIndex < workout.sets.length - 1) {
      setIsSetRest(true);
      setTimeLeft(workout.sets[currentSetIndex].rest * 2); // Longer rest between sets
    } else {
      handleComplete();
    }
  }, [workout, currentSetIndex, handleComplete]);

  const moveToNextRound = useCallback(() => {
    if (!workout) return;
    if (currentRoundIndex < workout.sets[currentSetIndex].rounds - 1) {
      setCurrentRoundIndex((prevIndex) => prevIndex + 1);
      setCurrentExerciseIndex(0);
      setIsResting(true);
      setTimeLeft(workout.sets[currentSetIndex].rest);
    } else {
      startSetRest();
    }
  }, [workout, currentRoundIndex, currentSetIndex, startSetRest]);

  const moveToNextExercise = useCallback(() => {
    if (!workout) return;
    const currentSet = workout.sets[currentSetIndex];
    if (currentExerciseIndex < currentSet.exercises.length - 1) {
      setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
    } else {
      moveToNextRound();
    }
  }, [workout, currentSetIndex, currentExerciseIndex, moveToNextRound]);

  const moveToNextSet = useCallback(() => {
    setCurrentSetIndex((prevIndex) => prevIndex + 1);
    setCurrentRoundIndex(0);
    setCurrentExerciseIndex(0);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if ((isResting || isGap || isSetRest) && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((time) => time - 1), 1000);
    } else if (timeLeft === 0) {
      if (isResting) {
        setIsResting(false);
      } else if (isGap) {
        setIsGap(false);
        moveToNextExercise();
      } else if (isSetRest) {
        setIsSetRest(false);
        moveToNextSet();
      }
    }
    return () => clearTimeout(timer);
  }, [isResting, isGap, isSetRest, timeLeft, moveToNextExercise, moveToNextSet]);

  const handleUpdateExercise = async (
    exerciseId: string,
    performance: {
      weight: number;
      reps?: number;
      time?: number;
      distance?: number;
    },
  ) => {
    if (!workout) return;

    const updatedWorkout = {
      ...workout,
      sets: workout.sets.map((set) => ({
        ...set,
        exercises: set.exercises.map((exercise) =>
          exercise.id === exerciseId
            ? {
                ...exercise,
                ...performance,
              }
            : exercise,
        ),
      })),
    };

    setWorkout(updatedWorkout);

    try {
      await updateWorkoutActivity(workout.id, [
        {
          id: exerciseId,
          exerciseId,
          ...performance,
          roundNumber: currentRoundIndex + 1,
          mode:
            workout.sets[currentSetIndex].exercises.find((e) => e.id === exerciseId)?.mode ||
            ExerciseMode.REPS,
        },
      ]);

      // Start gap timer if there's a gap and it's not the last exercise
      const currentSet = workout.sets[currentSetIndex];
      if (currentSet.gap && currentExerciseIndex < currentSet.exercises.length - 1) {
        setIsGap(true);
        setTimeLeft(currentSet.gap);
      } else {
        moveToNextExercise();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while updating the exercise',
      );
    }
  };

  const handleSkipRest = () => {
    if (isResting) {
      setIsResting(false);
    } else if (isSetRest) {
      setIsSetRest(false);
      moveToNextSet();
    } else if (isGap) {
      setIsGap(false);
      moveToNextExercise();
    }
    setTimeLeft(0);
  };

  if (error) {
    return (
      <Card className="mx-auto mt-8 max-w-lg">
        <CardContent>
          <p className="text-destructive">Error: {error}</p>
          <Button onClick={() => router.push('/workouts')} className="mt-4">
            Back to Workouts
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="mx-auto mt-8 max-w-lg">
        <CardContent>
          <p className="text-center">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!workout || workout.sets.length === 0) {
    return (
      <Card className="mx-auto mt-8 max-w-lg">
        <CardContent>
          <p className="text-center">No workout data available.</p>
          <Button onClick={() => router.push('/workouts')} className="mt-4">
            Back to Workouts
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentSet = workout.sets[currentSetIndex];
  const currentExercise = currentSet.exercises[currentExerciseIndex];

  const totalExercises = workout.sets.reduce(
    (total, set) => total + set.exercises.length * set.rounds,
    0,
  );
  const completedExercises =
    workout.sets
      .slice(0, currentSetIndex)
      .reduce((total, set) => total + set.exercises.length * set.rounds, 0) +
    currentSet.exercises.length * currentRoundIndex +
    currentExerciseIndex;
  const progress = (completedExercises / totalExercises) * 100;

  const nextSetEquipment =
    currentSetIndex < workout.sets.length - 1
      ? [...new Set(workout.sets[currentSetIndex + 1].exercises.map((e) => e.equipment))]
      : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-2xl">
        <CardContent>
          <WorkoutProgress
            workoutName={workout.name}
            progress={progress}
            currentSet={currentSet}
            currentRoundIndex={currentRoundIndex}
            currentExerciseIndex={currentExerciseIndex}
          />
          {isResting ? (
            <div className="py-8 text-center">
              <h3 className="mb-4 text-2xl font-bold">Rest Time</h3>
              <div className="mb-4 flex items-center justify-center gap-2">
                <Clock className="size-6" />
                <p className="font-mono text-4xl">{timeLeft}s</p>
              </div>
              <Progress value={(1 - timeLeft / currentSet.rest) * 100} className="mb-4 w-full" />
              <Button onClick={handleSkipRest}>Skip Rest</Button>
            </div>
          ) : isGap ? (
            <div className="py-8 text-center">
              <h3 className="mb-4 text-2xl font-bold">Gap Time</h3>
              <div className="mb-4 flex items-center justify-center gap-2">
                <Clock className="size-6" />
                <p className="font-mono text-4xl">{timeLeft}s</p>
              </div>
              <Progress value={(1 - timeLeft / currentSet.gap) * 100} className="mb-4 w-full" />
              <Button onClick={handleSkipRest}>Skip Gap</Button>
            </div>
          ) : isSetRest ? (
            <SetRest
              restTime={timeLeft}
              nextSetEquipment={nextSetEquipment}
              onSkipRest={handleSkipRest}
            />
          ) : (
            <WorkoutExercise
              key={`${currentExercise.id}-${currentRoundIndex}`}
              exercise={currentExercise}
              currentRound={currentRoundIndex + 1}
              totalRounds={currentSet.rounds}
              onComplete={handleUpdateExercise}
              userPreferences={userPreferences}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
