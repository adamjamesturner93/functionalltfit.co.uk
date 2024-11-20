'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ExerciseMode, Unit } from '@prisma/client';
import { Info, Dumbbell, Timer, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { convertWeight, convertDistance, formatDistance } from '@/lib/unit-conversion';

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
    },
  ) => void;
  userPreferences: {
    weightUnit: Unit;
    lengthUnit: Unit;
  };
}

export function WorkoutExercise({
  exercise,
  currentRound,
  totalRounds,
  onComplete,
  userPreferences,
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
      weight: userPreferences.weightUnit === Unit.IMPERIAL ? weight / 2.20462 : weight,
      ...(exercise.mode === ExerciseMode.REPS && { reps }),
      ...(exercise.mode === ExerciseMode.TIME && { time }),
      ...(exercise.mode === ExerciseMode.DISTANCE && {
        distance:
          userPreferences.lengthUnit === Unit.IMPERIAL ? distance * 1609.34 : distance * 1000,
      }),
    });
  };

  const roundToNearestHalf = (value: number) => {
    return Math.round(value * 2) / 2;
  };

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardHeader className="border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl font-bold">{exercise.name}</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="border-slate-800 bg-slate-900">
                <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg">
                  <video src={exercise.videoUrl} controls className="h-full w-full object-cover" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">Instructions</h4>
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
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm text-slate-400">Target</Label>
            <div className="text-2xl font-bold">
              {exercise.mode === ExerciseMode.REPS && `${exercise.targetReps} reps`}
              {exercise.mode === ExerciseMode.TIME && `${exercise.targetTime}s`}
              {exercise.mode === ExerciseMode.DISTANCE &&
                formatDistance(exercise.targetDistance || 0, userPreferences.lengthUnit)}
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
              Weight ({userPreferences.weightUnit === Unit.IMPERIAL ? 'lbs' : 'kg'})
            </Label>
            <Input
              id="weight"
              type="number"
              value={roundToNearestHalf(convertWeight(weight, userPreferences.weightUnit))}
              onChange={(e) => {
                const newWeight = parseFloat(e.target.value);
                setWeight(
                  userPreferences.weightUnit === Unit.IMPERIAL ? newWeight / 2.20462 : newWeight,
                );
              }}
              step={userPreferences.weightUnit === Unit.IMPERIAL ? 0.5 : 0.25}
              className="border-slate-800 bg-slate-950 text-lg focus:ring-indigo-500"
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
                className="border-slate-800 bg-slate-950 text-lg focus:ring-indigo-500"
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
                      'border-slate-800',
                      (isTimerRunning || countdown !== null) && 'bg-slate-800',
                    )}
                    onClick={handleStartTimer}
                  >
                    {isTimerRunning ? 'Pause' : 'Start'}
                    {isTimerRunning ? (
                      <Pause className="ml-2 h-4 w-4" />
                    ) : (
                      <Play className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-800"
                    onClick={handleResetTimer}
                  >
                    Reset
                    <RotateCcw className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {countdown !== null && (
                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="mb-2 text-sm text-slate-400">Starting in...</p>
                    <span className="font-mono text-4xl text-indigo-400">{countdown}</span>
                  </div>
                )}
                <div className="rounded-lg bg-slate-950 p-4 text-center">
                  <span className="font-mono text-4xl">{time}s</span>
                </div>
                {exercise.targetTime && (
                  <Progress value={(time / exercise.targetTime) * 100} className="h-2" />
                )}
              </div>
            </div>
          )}

          {exercise.mode === ExerciseMode.DISTANCE && (
            <div className="space-y-2">
              <Label htmlFor="distance" className="text-sm text-slate-400">
                Distance ({userPreferences.lengthUnit === Unit.IMPERIAL ? 'miles' : 'km'})
              </Label>
              <Input
                id="distance"
                type="number"
                value={convertDistance(distance, userPreferences.lengthUnit)}
                onChange={(e) => {
                  const newDistance = parseFloat(e.target.value);
                  setDistance(
                    userPreferences.lengthUnit === Unit.IMPERIAL
                      ? newDistance / 0.621371
                      : newDistance,
                  );
                }}
                step={0.1}
                className="border-slate-800 bg-slate-950 text-lg focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        <Button
          onClick={handleComplete}
          className="h-12 w-full bg-indigo-600 text-lg hover:bg-indigo-700"
        >
          Complete Exercise
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
