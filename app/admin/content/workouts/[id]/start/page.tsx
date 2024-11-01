"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  startWorkout,
  completeWorkout,
  updateWorkoutActivity,
} from "@/app/admin/actions/workouts";
import { getCurrentUserId } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WorkoutSummary from "./components/WorkoutSummary";
import ExerciseCard from "./components/ExerciseCard";
import WorkoutProgress from "./components/WorkoutProgress";
import { ExerciseMode } from "@prisma/client";

interface Exercise {
  id: string;
  exerciseId: string;
  name: string;
  targetReps: number;
  targetDistance?: number;
  targetTime?: number;
  weight: number;
  reps: number;
  time?: number;
  distance?: number;
  equipment: string;
  muscleGroups: string[];
  type: string;
  thumbnailUrl: string;
  videoUrl: string;
  mode: ExerciseMode;
  instructions: string;
  previousPerformance: {
    round: number;
    weight: number;
    reps: number;
    time?: number;
    distance?: number;
  }[];
}

interface Set {
  id: string;
  type: string;
  rounds: number;
  rest: number;
  gap: number | null;
  exercises: Exercise[];
  equipment: string[];
}

interface CombinedWorkout {
  id: string;
  workoutId: string;
  name: string;
  description: string | null;
  totalLength: number;
  equipment: string[];
  muscleGroups: string[];
  startedAt: string;
  endedAt: string | null;
  sets: Set[];
}

interface WorkoutSummary {
  totalDuration: number;
  totalWeightLifted: number;
  exercisesCompleted: number;
  weightLiftedImprovement: number | null;
  exercises: {
    id: string;
    exerciseId: string;
    name: string;
    weight: number;
    reps: number;
    targetReps: number;
    targetRounds: number;
    targetWeight: number;
    time?: number;
    distance?: number;
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
  }[];
}

export default function WorkoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<CombinedWorkout | null>(null);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [summary, setSummary] = useState<WorkoutSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const begin = async () => {
      try {
        setIsLoading(true);
        const currentUserId = await getCurrentUserId();
        setUserId(currentUserId);
        if (!currentUserId) {
          throw new Error("User not authenticated");
        }
        const combinedWorkout = await startWorkout(id as string, currentUserId);
        setWorkout(combinedWorkout);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    begin();
  }, [id]);

  const handleComplete = async () => {
    if (!workout || !userId) return;

    try {
      setIsLoading(true);
      const exercises = workout.sets.flatMap((set) =>
        set.exercises.map((exercise) => {
          const exerciseData: {
            id: string;
            exerciseId: string;
            weight: { [roundNumber: number]: number };
            reps?: { [roundNumber: number]: number };
            time?: { [roundNumber: number]: number };
            distance?: { [roundNumber: number]: number };
          } = {
            id: exercise.id,
            exerciseId: exercise.exerciseId,
            weight: {},
          };

          for (let round = 1; round <= set.rounds; round++) {
            exerciseData.weight[round] = exercise.weight;

            if (exercise.mode === ExerciseMode.REPS) {
              if (!exerciseData.reps) exerciseData.reps = {};
              exerciseData.reps[round] = exercise.reps;
            } else if (exercise.mode === ExerciseMode.TIME) {
              if (!exerciseData.time) exerciseData.time = {};
              exerciseData.time[round] = exercise.time || 0;
            } else if (exercise.mode === ExerciseMode.DISTANCE) {
              if (!exerciseData.distance) exerciseData.distance = {};
              exerciseData.distance[round] = exercise.distance || 0;
            }
          }

          return exerciseData;
        })
      );

      const result = await completeWorkout(
        workout.id,
        workout.workoutId,
        exercises,
        userId
      );
      setIsCompleted(true);
      setSummary(result.summary);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while completing the workout"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateExercise = async (
    exerciseId: string,
    field: "weight" | "reps" | "time" | "distance",
    value: number
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
                [field]: value,
              }
            : exercise
        ),
      })),
    };

    setWorkout(updatedWorkout);
  };

  const saveCurrentRound = async () => {
    if (!workout) return;

    try {
      await updateWorkoutActivity(
        workout.id,
        workout.sets.flatMap((set) =>
          set.exercises.map((exercise) => ({
            id: exercise.id,
            exerciseId: exercise.exerciseId,
            weight: exercise.weight,
            reps:
              exercise.mode === ExerciseMode.REPS ? exercise.reps : undefined,
            time:
              exercise.mode === ExerciseMode.TIME ? exercise.time : undefined,
            distance:
              exercise.mode === ExerciseMode.DISTANCE
                ? exercise.distance
                : undefined,
            roundNumber: currentRoundIndex + 1,
            mode: exercise.mode,
          }))
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating the exercise"
      );
    }
  };

  const handleNextRound = async () => {
    await saveCurrentRound();

    if (!workout) return;

    const currentSet = workout.sets[currentSetIndex];
    if (currentRoundIndex < currentSet.rounds - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1);
    } else if (currentSetIndex < workout.sets.length - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
      setCurrentRoundIndex(0);
    } else {
      await handleComplete();
    }
  };

  const handlePreviousRound = async () => {
    await saveCurrentRound();

    if (!workout) return;

    if (currentRoundIndex > 0) {
      setCurrentRoundIndex(currentRoundIndex - 1);
    } else if (currentSetIndex > 0) {
      setCurrentSetIndex(currentSetIndex - 1);
      setCurrentRoundIndex(workout.sets[currentSetIndex - 1].rounds - 1);
    }
  };

  if (error) {
    return (
      <Card className="max-w-lg mx-auto mt-8">
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
          <Button onClick={() => router.push("/workouts")} className="mt-4">
            Back to Workouts
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="max-w-lg mx-auto mt-8">
        <CardContent>
          <p className="text-center">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!workout || workout.sets.length === 0) {
    return (
      <Card className="max-w-lg mx-auto mt-8">
        <CardContent>
          <p className="text-center">No workout data available.</p>
          <Button onClick={() => router.push("/workouts")} className="mt-4">
            Back to Workouts
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isCompleted && summary) {
    return (
      <WorkoutSummary
        summary={summary}
        onBackToWorkouts={() => router.push("/workouts")}
        workoutId={workout.workoutId}
        userId={userId as string}
      />
    );
  }

  const currentSet = workout.sets[currentSetIndex];
  if (!currentSet) {
    return (
      <Card className="max-w-lg mx-auto mt-8">
        <CardContent>
          <p className="text-center">No sets found in the workout</p>
          <Button
            onClick={() => router.push("/admin/content/workouts")}
            className="mt-4"
          >
            Back to Workouts
          </Button>
        </CardContent>
      </Card>
    );
  }

  const totalSets = workout.sets.length;
  const progress =
    ((currentSetIndex * currentSet.rounds + currentRoundIndex) /
      (totalSets * currentSet.rounds)) *
    100;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent>
          <WorkoutProgress
            workoutName={workout.name}
            progress={progress}
            currentSet={currentSet}
            currentRoundIndex={currentRoundIndex}
          />
          <div className="grid gap-4">
            {currentSet.exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                currentRoundIndex={currentRoundIndex}
                onUpdateExercise={handleUpdateExercise}
              />
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePreviousRound}
              disabled={currentSetIndex === 0 && currentRoundIndex === 0}
              variant="outline"
            >
              Previous Round
            </Button>
            <Button onClick={handleNextRound}>
              {currentSetIndex === workout.sets.length - 1 &&
              currentRoundIndex === currentSet.rounds - 1
                ? "Complete Workout"
                : "Next Round"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
