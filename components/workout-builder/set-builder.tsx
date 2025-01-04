'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Exercise, ExerciseMode, SetType } from '@prisma/client';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ExerciseSelector } from './exercise-selector';

interface SetBuilderProps {
  setIndex: number;
  exercises: Exercise[];
  onSetTypeChange: (newType: SetType) => void;
}

export function SetBuilder({ setIndex, exercises, onSetTypeChange }: SetBuilderProps) {
  const { control, watch, setValue } = useFormContext();
  const { fields: setExercises, remove: removeExercise } = useFieldArray({
    control,
    name: `sets.${setIndex}.exercises`,
  });

  const setType = watch(`sets.${setIndex}.type`);

  const getMaxExercises = (type: SetType) => {
    switch (type) {
      case SetType.MULTISET:
        return 1;
      case SetType.SUPERSET:
        return 2;
      case SetType.TRISET:
        return 3;
      case SetType.CIRCUIT:
        return Infinity;
      default:
        return 1;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Set {setIndex + 1}</CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 p-0"
          onClick={() => {
            // This functionality should be handled in the parent component
          }}
        >
          <Trash2 className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select onValueChange={(value) => onSetTypeChange(value as SetType)} value={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SetType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Rounds</Label>
            <Input
              type="number"
              min={1}
              {...control.register(`sets.${setIndex}.rounds`, { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label>Rest</Label>
            <div className="relative">
              <Input
                type="number"
                min={0}
                {...control.register(`sets.${setIndex}.rest`, { valueAsNumber: true })}
                className="pr-16"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-sm text-gray-500">seconds</span>
              </div>
            </div>
          </div>

          {setType !== SetType.MULTISET && (
            <div className="space-y-2">
              <Label>Gap</Label>
              <div className="relative">
                <Input
                  type="number"
                  min={0}
                  defaultValue={0}
                  {...control.register(`sets.${setIndex}.gap`, { valueAsNumber: true })}
                  className="pr-16"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">seconds</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <ExerciseSelector
          setIndex={setIndex}
          exercises={exercises}
          maxExercises={getMaxExercises(setType as SetType)}
          showUnits={true}
        />
      </CardContent>
    </Card>
  );
}
