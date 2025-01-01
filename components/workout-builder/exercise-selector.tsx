'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Exercise, ExerciseMode } from '@prisma/client';
import { Plus, Trash2 } from 'lucide-react';

import { TypeaheadSelect } from '@/components/typeahead-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface ExerciseSelectorProps {
  setIndex: number;
  exercises: Exercise[];
  maxExercises: number;
  showUnits?: boolean;
}

export function ExerciseSelector({
  setIndex,
  exercises,
  maxExercises,
  showUnits = false,
}: ExerciseSelectorProps) {
  const { control, watch, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sets.${setIndex}.exercises`,
  });

  const watchFieldArray = watch(`sets.${setIndex}.exercises`);

  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const handleExerciseChange = (exerciseId: string, index: number) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    if (exercise) {
      setValue(`sets.${setIndex}.exercises.${index}.exerciseId`, exerciseId);
      setValue(`sets.${setIndex}.exercises.${index}.mode`, exercise.mode);
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Exercise</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Target</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {controlledFields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>
                <TypeaheadSelect
                  items={exercises.map((exercise) => ({ id: exercise.id, label: exercise.name }))}
                  value={field.exerciseId || ''}
                  onChange={(value: any) => handleExerciseChange(value, index)}
                  placeholder="Select exercise"
                />
              </TableCell>
              <TableCell>
                <Select
                  value={field.mode || ExerciseMode.REPS}
                  onValueChange={(value) =>
                    setValue(`sets.${setIndex}.exercises.${index}.mode`, value as ExerciseMode)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ExerciseMode).map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {field.mode === ExerciseMode.REPS && (
                  <div className="relative">
                    <Input
                      type="number"
                      min={1}
                      {...control.register(`sets.${setIndex}.exercises.${index}.targetReps`, {
                        valueAsNumber: true,
                      })}
                      className={cn(showUnits && 'pr-12')}
                    />
                    {showUnits && (
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-sm text-gray-500">reps</span>
                      </div>
                    )}
                  </div>
                )}
                {field.mode === ExerciseMode.TIME && (
                  <div className="relative">
                    <Input
                      type="number"
                      min={1}
                      {...control.register(`sets.${setIndex}.exercises.${index}.targetTime`, {
                        valueAsNumber: true,
                      })}
                      className={cn(showUnits && 'pr-16')}
                    />
                    {showUnits && (
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-sm text-gray-500">seconds</span>
                      </div>
                    )}
                  </div>
                )}
                {field.mode === ExerciseMode.DISTANCE && (
                  <div className="relative">
                    <Input
                      type="number"
                      min={0.1}
                      step={0.1}
                      {...control.register(`sets.${setIndex}.exercises.${index}.targetDistance`, {
                        valueAsNumber: true,
                      })}
                      className={cn(showUnits && 'pr-8')}
                    />
                    {showUnits && (
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-sm text-gray-500">m</span>
                      </div>
                    )}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {controlledFields.length < maxExercises && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            append({
              exerciseId: '',
              mode: ExerciseMode.REPS,
              targetReps: 10,
              targetTime: null,
              targetDistance: null,
              order: controlledFields.length + 1,
            });
          }}
        >
          <Plus className="mr-2 size-4" />
          Add Exercise
        </Button>
      )}
    </div>
  );
}
