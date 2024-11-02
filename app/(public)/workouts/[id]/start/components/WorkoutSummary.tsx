import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ExerciseSummary from "./ExerciseSummary";
import { ExerciseMode } from "@prisma/client";

interface ExerciseSummary {
  id: string;
  exerciseId: string;
  name: string;
  weight: number;
  reps: number;
  time?: number;
  distance?: number;
  targetReps: number;
  targetRounds: number;
  targetWeight: number;
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
  previousPerformance?: {
    round: number;
    weight: number;
    reps: number;
    time?: number;
    distance?: number;
  }[];
}

interface WorkoutSummaryProps {
  summary: {
    totalDuration: number;
    totalWeightLifted: number;
    exercisesCompleted: number;
    weightLiftedImprovement: number | null;
    exercises: ExerciseSummary[];
  };
  onBackToWorkouts: () => void;
  workoutId: string;
  userId: string;
}

export default function WorkoutSummary({
  summary,
  onBackToWorkouts,
  workoutId,
  userId,
}: WorkoutSummaryProps) {
  const readyToProgressCount = summary.exercises.filter(
    (ex) => ex.targetReached
  ).length;

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Workout Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Summary</h3>
          {summary.exercisesCompleted > 0 && (
            <p>You completed {summary.exercisesCompleted} exercises</p>
          )}
          <p>
            Total weight lifted: {summary.totalWeightLifted.toFixed(1)} kg
            {summary.weightLiftedImprovement !== null && (
              <span className="text-green-600 ml-2">
                (up {summary.weightLiftedImprovement.toFixed(1)}% from last
                time)
              </span>
            )}
          </p>
          <p>
            Workout time: {Math.floor(summary.totalDuration / 60)} :
            {(summary.totalDuration % 60).toString().padStart(2, "0")} minutes
          </p>
          <p>
            Ready to Progress: {readyToProgressCount} exercise
            {readyToProgressCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Details</h3>
          {summary.exercises.map((exercise) => (
            <ExerciseSummary
              key={exercise.id}
              exercise={exercise}
              workoutId={workoutId}
              userId={userId}
            />
          ))}
        </div>
        <Button onClick={onBackToWorkouts} className="mt-4 w-full">
          Back to Workouts
        </Button>
      </CardContent>
    </Card>
  );
}
