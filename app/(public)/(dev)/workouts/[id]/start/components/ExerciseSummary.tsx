import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExerciseMode } from "@prisma/client";
import { updateUserExerciseWeight } from "@/app/actions/workouts";

interface ExerciseSummaryProps {
  exercise: {
    id: string;
    exerciseId: string;
    name: string;
    targetRounds: number;
    targetReps: number;
    targetWeight: number;
    performanceByRound: {
      round: number;
      weight: number;
      reps: number;
      time?: number;
      distance?: number;
    }[];
    weight: number;
    reps: number;
    time?: number;
    distance?: number;
    targetReached: boolean;
    improvement: {
      reps: number;
      weight: number;
      time: number;
      distance: number;
    };
    mode: ExerciseMode;
    nextWorkoutWeight: number;
    previousPerformance?: {
      round: number;
      weight: number;
      reps: number;
      time?: number;
      distance?: number;
    }[];
  };
  workoutId: string;
  userId: string;
}

export default function ExerciseSummary({
  exercise,
  workoutId,
  userId,
}: ExerciseSummaryProps) {
  const [currentWeight, setCurrentWeight] = useState(exercise.weight);
  const [weightIncreased, setWeightIncreased] = useState(false);

  const renderPerformance = (
    performance: ExerciseSummaryProps["exercise"]["performanceByRound"][0],
    previousPerformance?: ExerciseSummaryProps["exercise"]["performanceByRound"][0]
  ) => {
    let result = "";
    switch (exercise.mode) {
      case ExerciseMode.REPS:
        result = `${performance.weight}kg x ${performance.reps} reps`;
        if (
          previousPerformance &&
          performance.reps > previousPerformance.reps
        ) {
          result += ` <span class="text-green-600">(+${
            performance.reps - previousPerformance.reps
          })</span>`;
        }
        break;
      case ExerciseMode.TIME:
        result = `${performance.time} seconds`;
        if (
          previousPerformance &&
          performance.time &&
          previousPerformance.time &&
          performance.time > previousPerformance.time
        ) {
          result += ` <span class="text-green-600">(+${
            performance.time - previousPerformance.time
          }s)</span>`;
        }
        break;
      case ExerciseMode.DISTANCE:
        result = `${performance.distance} meters`;
        if (
          previousPerformance &&
          performance.distance &&
          previousPerformance.distance &&
          performance.distance > previousPerformance.distance
        ) {
          result += ` <span class="text-green-600">(+${
            performance.distance - previousPerformance.distance
          }m)</span>`;
        }
        break;
      default:
        result = "N/A";
    }
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  const renderOverallPerformance = () => {
    switch (exercise.mode) {
      case ExerciseMode.REPS:
        return `${currentWeight.toFixed(1)}kg x ${exercise.reps.toFixed(
          1
        )} reps`;
      case ExerciseMode.TIME:
        return `${exercise.time?.toFixed(1)} seconds`;
      case ExerciseMode.DISTANCE:
        return `${exercise.distance?.toFixed(1)} meters`;
      default:
        return "N/A";
    }
  };

  const handleIncreaseWeight = async () => {
    const newWeight = Math.ceil((currentWeight * 1.05) / 2.5) * 2.5;
    try {
      await updateUserExerciseWeight(
        workoutId,
        exercise.exerciseId,
        newWeight,
        userId
      );
      setCurrentWeight(newWeight);
      setWeightIncreased(true);
    } catch (error) {
      console.error("Failed to update weight:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <h4 className="text-lg font-medium mb-2">{exercise.name}</h4>
        <div className="grid gap-2 mb-2">
          <p>
            Target: {exercise.targetRounds} x {exercise.targetReps} @{" "}
            {exercise.targetWeight}kg
          </p>
          {exercise.performanceByRound.map((round, index) => (
            <p key={round.round}>
              Round {round.round}:{" "}
              {renderPerformance(
                round,
                exercise.previousPerformance &&
                  exercise.previousPerformance[index]
              )}
            </p>
          ))}
          <p>Overall: {renderOverallPerformance()}</p>
        </div>
        {exercise.targetReached && exercise.mode === ExerciseMode.REPS && (
          <div className="mt-2">
            <p className="text-green-600 mb-2">
              Congratulations! You reached the target.
            </p>
            {weightIncreased ? (
              <p className="font-medium">
                You will start the next workout at {currentWeight.toFixed(1)}kg
              </p>
            ) : (
              <Button onClick={handleIncreaseWeight}>
                Increase weight to{" "}
                {Math.ceil((currentWeight * 1.05) / 2.5) * 2.5}kg
              </Button>
            )}
          </div>
        )}
        {exercise.improvement.reps > 0 && (
          <p className="text-blue-600 mb-2">
            You improved by {exercise.improvement.reps.toFixed(1)} reps and{" "}
            {exercise.improvement.weight.toFixed(1)} kg!
          </p>
        )}
        {exercise.improvement.time > 0 && (
          <p className="text-blue-600 mb-2">
            You improved by {exercise.improvement.time.toFixed(1)} seconds!
          </p>
        )}
        {exercise.improvement.distance > 0 && (
          <p className="text-blue-600 mb-2">
            You improved by {exercise.improvement.distance.toFixed(1)} meters!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
