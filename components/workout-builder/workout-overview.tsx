'use client';

import { useMemo } from 'react';
import { Exercise, SetType } from '@prisma/client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface WorkoutOverviewProps {
  warmup: { exerciseId: string; duration: number }[];
  sets: {
    type: SetType;
    rounds: number;
    rest: number;
    gap?: number;
    exercises: { exerciseId: string; targetReps: number | null }[];
  }[];
  cooldown: { exerciseId: string; duration: number }[];
  exercises: Exercise[];
}

const formatTime = (seconds: number): string => {
  if (seconds < 90) {
    return `${seconds} seconds`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
};

export function WorkoutOverview({ warmup, sets, cooldown, exercises }: WorkoutOverviewProps) {
  const stats = useMemo(() => {
    const warmupTime = warmup?.reduce((acc, group) => acc + (group.duration || 0), 0) || 0;
    const cooldownTime = cooldown?.reduce((acc, group) => acc + (group.duration || 0), 0) || 0;
    const mainTime =
      sets?.reduce((acc, set) => {
        const setTime =
          (set.rounds || 0) *
            (set.exercises?.reduce((total: number, exercise: { targetReps: number | null }) => {
              return total + (exercise.targetReps || 0) * 3;
            }, 0) || 0 + (set.gap || 0)) +
          (set.rest || 0);
        return acc + setTime;
      }, 0) || 0;

    const totalTime = warmupTime + mainTime + cooldownTime;

    const equipment = new Set<string>();
    const muscleGroups = new Set<string>();

    const processExercises = (exerciseIds: string[] | undefined) => {
      if (!exerciseIds) return;
      exerciseIds.forEach((id) => {
        const exerciseData = exercises.find((e) => e.id === id);
        if (exerciseData) {
          exerciseData.equipment.forEach((eq) => equipment.add(eq));
          exerciseData.muscleGroupCategories?.forEach((mg: string) => muscleGroups.add(mg));
        }
      });
    };

    warmup?.forEach((group) => processExercises([group.exerciseId]));
    sets?.forEach((set) =>
      set.exercises?.forEach((exercise) => processExercises([exercise.exerciseId])),
    );
    cooldown?.forEach((group) => processExercises([group.exerciseId]));

    return {
      totalTime,
      warmupTime,
      mainTime,
      cooldownTime,
      equipment: Array.from(equipment),
      muscleGroups: Array.from(muscleGroups),
    };
  }, [warmup, sets, cooldown, exercises]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Duration</CardTitle>
          <CardDescription>Estimated workout time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatTime(stats.totalTime)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Breakdown</CardTitle>
          <CardDescription>Time per section</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>Warm-up: {formatTime(stats.warmupTime)}</li>
            <li>Main workout: {formatTime(stats.mainTime)}</li>
            <li>Cool-down: {formatTime(stats.cooldownTime)}</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equipment</CardTitle>
          <CardDescription>Required for this workout</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc">
            {stats.equipment.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Muscle Groups</CardTitle>
          <CardDescription>Areas targeted</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc">
            {stats.muscleGroups.map((group) => (
              <li key={group}>{group}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
