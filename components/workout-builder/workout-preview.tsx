'use client';

import { Exercise, ExerciseMode, SetType } from '@prisma/client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface WorkoutPreviewProps {
  warmup: { exerciseId: string; duration: number }[];
  sets: {
    type: SetType;
    rounds: number;
    rest: number;
    gap?: number;
    exercises: {
      exerciseId: string;
      mode: ExerciseMode;
      targetReps: number | null;
      targetTime: number | null;
      targetDistance: number | null;
      order: number;
    }[];
  }[];
  cooldown: { exerciseId: string; duration: number }[];
  exercises: Exercise[];
}

export function WorkoutPreview({ warmup, sets, cooldown, exercises }: WorkoutPreviewProps) {
  const getExerciseName = (exerciseId: string | undefined) => {
    if (!exerciseId) return 'No exercise selected';
    return exercises.find((e) => e.id === exerciseId)?.name || 'Unknown';
  };

  const getTargetValue = (exercise: WorkoutPreviewProps['sets'][0]['exercises'][0]) => {
    switch (exercise.mode) {
      case ExerciseMode.REPS:
        return `${exercise.targetReps || 0} reps`;
      case ExerciseMode.TIME:
        return `${exercise.targetTime || 0} seconds`;
      case ExerciseMode.DISTANCE:
        return `${exercise.targetDistance || 0} meters`;
      default:
        return 'N/A';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Preview</CardTitle>
        <CardDescription>See how your workout will look to users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">Warm-up</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exercise</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warmup &&
                warmup.map((group, index) => (
                  <TableRow key={index}>
                    <TableCell>{getExerciseName(group.exerciseId)}</TableCell>
                    <TableCell>{group.duration} seconds</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {sets &&
          sets.map((set, setIndex) => (
            <div key={setIndex} className="mb-8">
              <h3 className="mb-4 text-lg font-semibold">
                Set {setIndex + 1} - {set.type}
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exercise</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Rounds</TableHead>
                    <TableHead>Rest</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {set.exercises &&
                    set.exercises.map((exercise, exerciseIndex) => (
                      <TableRow key={exerciseIndex}>
                        <TableCell>{getExerciseName(exercise.exerciseId)}</TableCell>
                        <TableCell>{exercise.mode}</TableCell>
                        <TableCell>{getTargetValue(exercise)}</TableCell>
                        <TableCell>{set.rounds}</TableCell>
                        <TableCell>
                          {exerciseIndex === set.exercises.length - 1
                            ? `${set.rest}s`
                            : `${set.gap || 0}s`}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ))}

        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">Cool-down</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exercise</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cooldown &&
                cooldown.map((group, index) => (
                  <TableRow key={index}>
                    <TableCell>{getExerciseName(group.exerciseId)}</TableCell>
                    <TableCell>{group.duration} seconds</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
