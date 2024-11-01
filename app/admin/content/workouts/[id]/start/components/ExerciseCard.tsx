import { useEffect, useReducer, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExerciseCardProps {
  exercise: {
    id: string;
    name: string;
    mode: string;
    weight: number;
    reps: number;
    time?: number;
    distance?: number;
    targetReps: number;
    targetTime?: number;
    targetDistance?: number;
    previousPerformance: {
      round: number;
      weight: number;
      reps: number;
      time?: number;
      distance?: number;
    }[];
  };
  currentRoundIndex: number;
  onUpdateExercise: (
    exerciseId: string,
    field: "weight" | "reps" | "time" | "distance",
    value: number
  ) => void;
}

type State = {
  weight: number;
  reps: number;
  time: number;
  distance: number;
};

type Action =
  | { type: "SET_WEIGHT"; payload: number }
  | { type: "SET_REPS"; payload: number }
  | { type: "SET_TIME"; payload: number }
  | { type: "SET_DISTANCE"; payload: number }
  | { type: "SET_ALL"; payload: State };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_WEIGHT":
      return { ...state, weight: action.payload };
    case "SET_REPS":
      return { ...state, reps: action.payload };
    case "SET_TIME":
      return { ...state, time: action.payload };
    case "SET_DISTANCE":
      return { ...state, distance: action.payload };
    case "SET_ALL":
      return action.payload;
    default:
      return state;
  }
}

function getInitialState(
  exercise: ExerciseCardProps["exercise"],
  currentRoundIndex: number
): State {
  const previousPerformance = exercise.previousPerformance.find(
    (p) => p.round === currentRoundIndex + 1
  );

  return {
    weight: exercise.weight || 0,
    reps:
      exercise.reps ||
      previousPerformance?.reps ||
      Math.round(0.8 * exercise.targetReps),
    time:
      exercise.time ||
      previousPerformance?.time ||
      Math.round(0.8 * (exercise.targetTime || 0)),
    distance:
      exercise.distance ||
      previousPerformance?.distance ||
      Math.round(0.8 * (exercise.targetDistance || 0)),
  };
}

export default function ExerciseCard({
  exercise,
  currentRoundIndex,
  onUpdateExercise,
}: ExerciseCardProps) {
  const [state, dispatch] = useReducer(
    reducer,
    getInitialState(exercise, currentRoundIndex)
  );

  const previousRoundIndexRef = useRef(currentRoundIndex);

  const updateExerciseField = useCallback(
    (field: "weight" | "reps" | "time" | "distance", value: number) => {
      onUpdateExercise(exercise.id, field, value);
    },
    [exercise.id, onUpdateExercise]
  );

  useEffect(() => {
    if (previousRoundIndexRef.current !== currentRoundIndex) {
      const newState = getInitialState(exercise, currentRoundIndex);
      dispatch({ type: "SET_ALL", payload: newState });

      updateExerciseField("weight", newState.weight);
      if (exercise.mode === "REPS") updateExerciseField("reps", newState.reps);
      if (exercise.mode === "TIME") updateExerciseField("time", newState.time);
      if (exercise.mode === "DISTANCE")
        updateExerciseField("distance", newState.distance);

      previousRoundIndexRef.current = currentRoundIndex;
    }
  }, [exercise, currentRoundIndex, updateExerciseField]);

  const getTargetDisplay = () => {
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

  const getPreviousPerformance = () => {
    const previousRound = exercise.previousPerformance?.find(
      (p) => p.round === currentRoundIndex + 1
    );
    if (!previousRound) return "-";

    switch (exercise.mode) {
      case "REPS":
        return `${previousRound.weight}kg x ${previousRound.reps} reps`;
      case "TIME":
        return `${previousRound.time} seconds`;
      case "DISTANCE":
        return `${previousRound.distance} meters`;
      default:
        return "-";
    }
  };

  const handleWeightChange = (value: string) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      dispatch({ type: "SET_WEIGHT", payload: numValue });
      updateExerciseField("weight", numValue);
    }
  };

  const handleRepsChange = (value: string) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      dispatch({ type: "SET_REPS", payload: numValue });
      updateExerciseField("reps", numValue);
    }
  };

  const handleTimeChange = (value: string) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      dispatch({ type: "SET_TIME", payload: numValue });
      updateExerciseField("time", numValue);
    }
  };

  const handleDistanceChange = (value: string) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      dispatch({ type: "SET_DISTANCE", payload: numValue });
      updateExerciseField("distance", numValue);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <h4 className="text-lg font-medium mb-2">{exercise.name}</h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Target</p>
            <p className="text-base">{getTargetDisplay()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Previous (Round {currentRoundIndex + 1})
            </p>
            <p className="text-base">{getPreviousPerformance()}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor={`weight-${exercise.id}`}>Weight (kg)</Label>
            <Input
              id={`weight-${exercise.id}`}
              type="number"
              value={state.weight}
              onChange={(e) => handleWeightChange(e.target.value)}
              className="mt-1"
            />
          </div>
          {exercise.mode === "REPS" && (
            <div className="flex-1">
              <Label htmlFor={`reps-${exercise.id}`}>Reps</Label>
              <Input
                id={`reps-${exercise.id}`}
                type="number"
                value={state.reps}
                onChange={(e) => handleRepsChange(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
          {exercise.mode === "TIME" && (
            <div className="flex-1">
              <Label htmlFor={`time-${exercise.id}`}>Time (seconds)</Label>
              <Input
                id={`time-${exercise.id}`}
                type="number"
                value={state.time}
                onChange={(e) => handleTimeChange(e.target.value)}
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
                value={state.distance}
                onChange={(e) => handleDistanceChange(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
