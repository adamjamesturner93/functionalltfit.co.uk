import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Exercise } from '@prisma/client';
import { Plus, Trash2 } from 'lucide-react';

import { TypeaheadSelect } from '@/components/typeahead-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CooldownBuilderProps {
  exercises: Exercise[];
}

export function CooldownBuilder({ exercises }: CooldownBuilderProps) {
  const { control, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'cooldown',
  });

  // Use useWatch to trigger rerenders when cooldown values change
  const cooldownValues = useWatch({
    control,
    name: 'cooldown',
  });

  if (!exercises || exercises.length === 0) {
    console.warn('No exercises provided to CooldownBuilder');
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cool-down</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No exercises available. Please add exercises to the database first.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cool-down</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exercise</TableHead>
              <TableHead>Duration (seconds)</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <TypeaheadSelect
                    items={exercises.map((exercise) => ({ id: exercise.id, label: exercise.name }))}
                    value={cooldownValues[index]?.exerciseId || ''}
                    onChange={(value) => setValue(`cooldown.${index}.exerciseId`, value)}
                    placeholder="Select exercise"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={1}
                    {...control.register(`cooldown.${index}.duration`, { valueAsNumber: true })}
                  />
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

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            append({
              exerciseId: '',
              duration: 60,
            });
          }}
        >
          <Plus className="mr-2 size-4" />
          Add Cool-down Exercise
        </Button>
      </CardContent>
    </Card>
  );
}
