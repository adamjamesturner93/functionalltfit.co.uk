"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ExerciseMode } from "@prisma/client";
import {
  Info,
  Dumbbell,
  Timer,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  equipment: string;
  instructions: string;
  videoUrl: string;
  thumbnailUrl: string;
}

interface WorkoutExerciseProps {
  exercise: Exercise;
  currentRound: number;
  totalRounds: number;
  onComplete: (
    exerciseId: string,
    performance: {
      weight: number;
      reps?: number;
      time?: number;
      distance?: number;
    }
  ) => void;
}

export function WorkoutExercise({
  exercise,
  currentRound,
  totalRounds,
  onComplete,
}: WorkoutExerciseProps) {
  const [weight, setWeight] = useState(exercise.weight);
  const [reps, setReps] = useState(exercise.reps);
  const [time, setTime] = useState(exercise.time || 0);
  const [distance, setDistance] = useState(exercise.distance || 0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown !== null && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev as number) - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCountdown(null);
      setIsTimerRunning(true);
    }

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTimerRunning) {
      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const handleStartTimer = () => {
    if (!isTimerRunning && countdown === null) {
      setCountdown(5);
    } else {
      setIsTimerRunning(false);
    }
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setCountdown(null);
    setTime(0);
  };

  const handleComplete = () => {
    onComplete(exercise.id, {
      weight,
      ...(exercise.mode === ExerciseMode.REPS && { reps }),
      ...(exercise.mode === ExerciseMode.TIME && { time }),
      ...(exercise.mode === ExerciseMode.DISTANCE && { distance }),
    });
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl font-bold">
              {exercise.name}
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800">
                <div className="aspect-video w-full rounded-lg overflow-hidden mb-4">
                  <video
                    src={exercise.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">Instructions</h4>
                  <p className="text-slate-400">{exercise.instructions}</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Timer className="h-4 w-4" />
            <span>
              Round {currentRound} of {totalRounds}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm text-slate-400">Target</Label>
            <div className="text-2xl font-bold">
              {exercise.mode === ExerciseMode.REPS &&
                `${exercise.targetReps} reps`}
              {exercise.mode === ExerciseMode.TIME && `${exercise.targetTime}s`}
              {exercise.mode === ExerciseMode.DISTANCE &&
                `${exercise.targetDistance}m`}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-slate-400">Equipment</Label>
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Dumbbell className="h-5 w-5" />
              {exercise.equipment}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm text-slate-400">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="text-lg bg-slate-950 border-slate-800 focus:ring-indigo-500"
            />
          </div>

          {exercise.mode === ExerciseMode.REPS && (
            <div className="space-y-2">
              <Label htmlFor="reps" className="text-sm text-slate-400">
                Reps
              </Label>
              <Input
                id="reps"
                type="number"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="text-lg bg-slate-950 border-slate-800 focus:ring-indigo-500"
              />
            </div>
          )}

          {exercise.mode === ExerciseMode.TIME && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-slate-400">Time</Label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "border-slate-800",
                      (isTimerRunning || countdown !== null) && "bg-slate-800"
                    )}
                    onClick={handleStartTimer}
                  >
                    {isTimerRunning ? "Pause" : "Start"}
                    {isTimerRunning ? (
                      <Pause className="h-4 w-4 ml-2" />
                    ) : (
                      <Play className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-800"
                    onClick={handleResetTimer}
                  >
                    Reset
                    <RotateCcw className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {countdown !== null && (
                  <div className="bg-slate-800 rounded-lg p-4 text-center">
                    <p className="text-sm text-slate-400 mb-2">
                      Starting in...
                    </p>
                    <span className="font-mono text-4xl text-indigo-400">
                      {countdown}
                    </span>
                  </div>
                )}
                <div className="bg-slate-950 rounded-lg p-4 text-center">
                  <span className="font-mono text-4xl">{time}s</span>
                </div>
                {exercise.targetTime && (
                  <Progress
                    value={(time / exercise.targetTime) * 100}
                    className="h-2"
                  />
                )}
              </div>
            </div>
          )}

          {exercise.mode === ExerciseMode.DISTANCE && (
            <div className="space-y-2">
              <Label htmlFor="distance" className="text-sm text-slate-400">
                Distance (meters)
              </Label>
              <Input
                id="distance"
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="text-lg bg-slate-950 border-slate-800 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        <Button
          onClick={handleComplete}
          className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg"
        >
          Complete Exercise
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
