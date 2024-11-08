import { Progress } from "@/components/ui/progress";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface Exercise {
  id: string;
  name: string;
}

interface Set {
  type: string;
  rounds: number;
  exercises: Exercise[];
}

interface WorkoutProgressProps {
  workoutName: string;
  progress: number;
  currentSet: Set;
  currentRoundIndex: number;
  currentExerciseIndex: number;
}

export function WorkoutProgress({
  workoutName,
  progress,
  currentSet,
  currentRoundIndex,
  currentExerciseIndex,
}: WorkoutProgressProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{workoutName}</CardTitle>
      </CardHeader>
      <div className="mb-4">
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground mt-1">
          Progress: {progress.toFixed(2)}%
        </p>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{currentSet.type} Set</h2>
        <div className="text-sm text-muted-foreground">
          <span>
            Round {currentRoundIndex + 1} of {currentSet.rounds}
          </span>
          <span className="mx-2">|</span>
          <span>
            Exercise {currentExerciseIndex + 1} of {currentSet.exercises.length}
          </span>
        </div>
      </div>
    </>
  );
}
