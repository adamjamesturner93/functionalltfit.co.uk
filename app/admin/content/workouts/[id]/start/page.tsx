"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  startWorkout,
  completeWorkout,
  updateWorkoutActivity,
  updateUserExerciseWeight,
} from "@/app/admin/actions/workouts";
import { getCurrentUserId } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Clock, Dumbbell, Repeat } from "lucide-react";

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
  previousWeight: number | null;
  previousReps: number | null;
  previousTime?: number | null;
  previousDistance?: number | null;
  equipment: string;
  muscleGroups: string[];
  type: string;
  thumbnailUrl: string;
  videoUrl: string;
  mode: string;
  instructions: string;
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
  const [weightIncreaseMessages, setWeightIncreaseMessages] = useState<{
    [key: string]: string;
  }>({});
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
        set.exercises.map((exercise) => ({
          id: exercise.id,
          exerciseId: exercise.exerciseId,
          weight: exercise.weight,
          reps: exercise.reps,
          time: exercise.time,
          distance: exercise.distance,
        }))
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
            ? { ...exercise, [field]: value }
            : exercise
        ),
      })),
    };

    setWorkout(updatedWorkout);

    try {
      await updateWorkoutActivity(
        workout.id,
        updatedWorkout.sets.flatMap((set) => set.exercises)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating the exercise"
      );
    }
  };

  const handleIncreaseWeight = async (
    exerciseId: string,
    currentWeight: number,
    exerciseName: string
  ) => {
    if (!userId || !workout) {
      setError("User or workout information is missing");
      return;
    }

    const newWeight = Math.ceil((currentWeight * 1.05) / 2.5) * 2.5;
    try {
      await updateUserExerciseWeight(
        workout.workoutId,
        exerciseId,
        newWeight,
        userId
      );
      setSummary((prevSummary) => ({
        ...prevSummary!,
        exercises: prevSummary!.exercises.map((ex) =>
          ex.exerciseId === exerciseId
            ? { ...ex, nextWorkoutWeight: newWeight }
            : ex
        ),
      }));
      setWeightIncreaseMessages((prev) => ({
        ...prev,
        [exerciseId]: `Next time we'll start you on ${newWeight}kg for ${exerciseName}!`,
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating the weight"
      );
    }
  };

  const getTargetDisplay = (exercise: Exercise) => {
    console.log(exercise);
    switch (exercise.mode) {
      case "REPS":
        return `${exercise.weight}kg x ${exercise.targetReps} reps`;
      case "TIME":
        return `${exercise.targetTime} seconds`;
      case "DISTANCE":
        return `${exercise.targetDistance} meters`;
      default:
        return "N/A";
    }
  };

  const getPreviousPerformance = (exercise: Exercise) => {
    switch (exercise.mode) {
      case "REPS":
        return exercise.previousWeight && exercise.previousReps
          ? `${exercise.previousWeight}kg x ${exercise.previousReps} reps`
          : "-";
      case "TIME":
        return exercise.previousTime ? `${exercise.previousTime} seconds` : "-";
      case "DISTANCE":
        return exercise.previousDistance
          ? `${exercise.previousDistance} meters`
          : "-";
      default:
        return "-";
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
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Workout Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <p>
              Total Duration: {Math.floor(summary.totalDuration / 60)} minutes
            </p>
            <p>Total Weight Lifted: {summary.totalWeightLifted} kg</p>
          </div>
          <h2 className="text-xl font-semibold mt-4 mb-2">
            Exercise Breakdown
          </h2>
          {summary.exercises.map((exercise) => (
            <Card key={exercise.id} className="mb-4">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-2">{exercise.name}</h3>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <p>
                    Target: {exercise.targetRounds} x {exercise.targetReps} @{" "}
                    {exercise.targetWeight}kg
                  </p>
                  <p>
                    Achieved: {exercise.reps} reps @ {exercise.weight}kg
                  </p>
                </div>
                {exercise.targetReached && (
                  <p className="text-green-600 mb-2">
                    Congratulations! You reached the target.
                  </p>
                )}
                {exercise.improvement.reps > 0 && (
                  <p className="text-blue-600 mb-2">
                    You improved by {exercise.improvement.reps} reps and{" "}
                    {exercise.improvement.weight} kg!
                  </p>
                )}
                {exercise.targetReached &&
                  !weightIncreaseMessages[exercise.exerciseId] && (
                    <Button
                      onClick={() =>
                        handleIncreaseWeight(
                          exercise.exerciseId,
                          exercise.weight,
                          exercise.name
                        )
                      }
                      className="mt-2"
                    >
                      Increase Weight for Next Time
                    </Button>
                  )}
                {weightIncreaseMessages[exercise.exerciseId] && (
                  <Alert className="mt-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Weight Increased</AlertTitle>
                    <AlertDescription>
                      {weightIncreaseMessages[exercise.exerciseId]}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
          <Button
            onClick={() => router.push("/workouts")}
            className="mt-4 w-full"
          >
            Back to Workouts
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentSet = workout.sets[currentSetIndex];
  if (!currentSet) {
    return (
      <Card className="max-w-lg mx-auto mt-8">
        <CardContent>
          <p className="text-center">No sets found in the workout</p>
          <Button onClick={() => router.push("/workouts")} className="mt-4">
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

  const handleNextRound = () => {
    if (currentRoundIndex < currentSet.rounds - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1);
    } else if (currentSetIndex < workout.sets.length - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
      setCurrentRoundIndex(0);
    } else {
      handleComplete();
    }
  };

  const handlePreviousRound = () => {
    if (currentRoundIndex > 0) {
      setCurrentRoundIndex(currentRoundIndex - 1);
    } else if (currentSetIndex > 0) {
      setCurrentSetIndex(currentSetIndex - 1);
      setCurrentRoundIndex(workout.sets[currentSetIndex - 1].rounds - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{workout.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500 mt-1">
              Progress: {progress.toFixed(2)}%
            </p>
          </div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{currentSet.type} Set</h2>
            <div className="flex items-center">
              <Repeat className="w-5 h-5 mr-1" />
              <span>
                Round {currentRoundIndex + 1} of {currentSet.rounds}
              </span>
            </div>
          </div>
          <div className="mb-4 p-2 bg-gray-100 rounded-md">
            <h3 className="text-sm font-medium mb-1">Set Equipment:</h3>
            <p className="text-sm">
              {currentSet.equipment ? currentSet.equipment.join(", ") : "None"}
            </p>
          </div>
          <div className="grid gap-4">
            {currentSet.exercises.map((exercise) => (
              <Card key={exercise.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <h4 className="text-lg font-medium mb-2">{exercise.name}</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Target
                      </p>
                      <p className="text-base">{getTargetDisplay(exercise)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Previous
                      </p>
                      <p className="text-base">
                        {getPreviousPerformance(exercise)}
                      </p>
                    </div>
                  </div>
                  <div className="flex  gap-4">
                    {exercise.mode === "REPS" && (
                      <>
                        <div className="flex-1">
                          <Label htmlFor={`weight-${exercise.id}`}>
                            Weight (kg)
                          </Label>
                          <Input
                            id={`weight-${exercise.id}`}
                            type="number"
                            value={exercise.weight}
                            onChange={(e) =>
                              handleUpdateExercise(
                                exercise.id,
                                "weight",
                                Number(e.target.value)
                              )
                            }
                            className="mt-1"
                          />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor={`reps-${exercise.id}`}>Reps</Label>
                          <Input
                            id={`reps-${exercise.id}`}
                            type="number"
                            value={exercise.reps}
                            onChange={(e) =>
                              handleUpdateExercise(
                                exercise.id,
                                "reps",
                                Number(e.target.value)
                              )
                            }
                            className="mt-1"
                          />
                        </div>
                      </>
                    )}
                    {exercise.mode === "TIME" && (
                      <div className="flex-1">
                        <Label htmlFor={`time-${exercise.id}`}>
                          Time (seconds)
                        </Label>
                        <Input
                          id={`time-${exercise.id}`}
                          type="number"
                          value={exercise.time}
                          onChange={(e) =>
                            handleUpdateExercise(
                              exercise.id,
                              "time",
                              Number(e.target.value)
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                    )}
                    {exercise.mode === "DISTANCE" && (
                      <div className="flex-1">
                        <Label htmlFor={`distance-${exercise.id}`}>
                          Distance (meters)
                        </Label>
                        <Input
                          id={`distance-${exercise.id}`}
                          type="number"
                          value={exercise.distance}
                          onChange={(e) =>
                            handleUpdateExercise(
                              exercise.id,
                              "distance",
                              Number(e.target.value)
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>Rest: {currentSet.rest} seconds</span>
              </div>
              {currentSet.gap && (
                <div className="flex items-center">
                  <Dumbbell className="w-5 h-5 mr-2" />
                  <span>Gap: {currentSet.gap} seconds</span>
                </div>
              )}
            </div>
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
