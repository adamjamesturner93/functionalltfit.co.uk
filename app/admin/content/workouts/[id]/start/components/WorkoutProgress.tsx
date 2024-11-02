import { Progress } from "@/components/ui/progress";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Dumbbell, Repeat } from "lucide-react";

interface WorkoutProgressProps {
  workoutName: string;
  progress: number;
  currentSet: {
    type: string;
    rounds: number;
    rest: number;
    gap: number | null;
    equipment: string[];
  };
  currentRoundIndex: number;
}

export default function WorkoutProgress({
  workoutName,
  progress,
  currentSet,
  currentRoundIndex,
}: WorkoutProgressProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{workoutName}</CardTitle>
      </CardHeader>
      <div className="mb-4">
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-bg-surface-light-grey0 mt-1">
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
    </>
  );
}
