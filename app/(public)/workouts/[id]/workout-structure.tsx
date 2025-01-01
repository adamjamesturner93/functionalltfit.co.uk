'use client';

import { Flame, Snowflake } from 'lucide-react';

import { WorkoutWithSets } from '@/app/actions/workouts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatTime } from '@/lib/utils';

function formatTarget(value: number | null, mode: string) {
  if (!value) return '';
  if (mode === 'TIME') {
    return formatTime(value);
  }
  if (mode === 'DISTANCE') {
    return value >= 1000 ? `${(value / 1000).toFixed(2)}km` : `${value}m`;
  }
  return `${value} ${mode.toLowerCase()}`;
}

export function WorkoutStructure({ workout }: { workout: WorkoutWithSets }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Workout Structure</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="multiple" className="w-full">
          {/* Warm-up Section */}
          {workout.warmup && workout.warmup.length > 0 && (
            <AccordionItem value="warmup">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Flame className="size-5 text-orange-500" />
                    <span className="text-lg font-semibold">Warm-up</span>
                  </div>
                  <Badge variant="outline">
                    {formatTime(workout.warmup.reduce((acc, ex) => acc + ex.duration, 0))}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="divide-y divide-border px-6">
                  {workout.warmup.map((exercise) => (
                    <div key={exercise.id} className="flex items-center justify-between py-4">
                      <div className="space-y-1">
                        <p className="font-medium">{exercise.exercise.name}</p>
                        <p className="text-sm text-muted">
                          {exercise.exercise.equipment.join(', ')}
                        </p>
                      </div>
                      <Badge variant="secondary">{formatTime(exercise.duration)}</Badge>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Main Workout Section */}
          {workout.sets.map((set, index) => (
            <AccordionItem key={set.id} value={`set-${index}`}>
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold">Set {index + 1}</span>
                    <Badge>{set.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{set.rounds} rounds</Badge>
                    <Badge variant="outline">{formatTime(set.rest)} rest</Badge>
                    {set.gap && <Badge variant="outline">{formatTime(set.gap)} gap</Badge>}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="divide-y divide-border px-6">
                  {set.exercises.map(
                    ({ exercise, targetReps, targetTime, targetDistance, mode }) => (
                      <div key={exercise.id} className="flex items-center justify-between py-4">
                        <div className="space-y-1">
                          <p className="font-medium">{exercise.name}</p>
                          <p className="text-sm text-muted">{exercise.equipment.join(', ')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="ml-auto">
                            {mode === 'REPS' && formatTarget(targetReps, mode)}
                            {mode === 'TIME' && formatTarget(targetTime, mode)}
                            {mode === 'DISTANCE' && formatTarget(targetDistance, mode)}
                          </Badge>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}

          {/* Cool-down Section */}
          {workout.cooldown && workout.cooldown.length > 0 && (
            <AccordionItem value="cooldown">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Snowflake className="size-5 text-blue-500" />
                    <span className="text-lg font-semibold">Cool-down</span>
                  </div>
                  <Badge variant="outline">
                    {formatTime(workout.cooldown.reduce((acc, ex) => acc + ex.duration, 0))}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="divide-y divide-border px-6">
                  {workout.cooldown.map((exercise) => (
                    <div key={exercise.id} className="flex items-center justify-between py-4">
                      <div className="space-y-1">
                        <p className="font-medium">{exercise.exercise.name}</p>
                        <p className="text-sm text-muted">
                          {exercise.exercise.equipment.join(', ')}
                        </p>
                      </div>
                      <Badge variant="secondary">{formatTime(exercise.duration)}</Badge>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}
