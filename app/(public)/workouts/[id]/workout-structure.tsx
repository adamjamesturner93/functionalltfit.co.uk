import { WorkoutWithSets } from '@/app/actions/workouts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

function formatTarget(value: number, mode: string) {
  if (mode === 'TIME') {
    return value < 91 ? `${value}s` : `${Math.floor(value / 60)}min`;
  }
  if (mode === 'DISTANCE') {
    return value >= 1000 ? `${(value / 1000).toFixed(2)}km` : `${value}m`;
  }
  return `${value} ${mode.toLowerCase()}`;
}

export function WorkoutStructure({ workout }: { workout: WorkoutWithSets }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Workout Structure</h2>
      <Accordion type="single" collapsible className="w-full">
        {workout.sets.map((set, index) => (
          <AccordionItem key={set.id} value={`set-${index}`}>
            <AccordionTrigger>
              <div className="flex items-center gap-4">
                <span>
                  Set {index + 1}: {set.type}
                </span>
                <Badge variant="outline">{set.rounds} rounds</Badge>
                <Badge variant="outline">{set.rest}s rest</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {set.exercises.map(({ exercise, targetReps }) => (
                  <li key={exercise.id} className="flex items-center justify-between">
                    <span>{exercise.name}</span>
                    <Badge>{formatTarget(targetReps, exercise.mode)}</Badge>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
