'use client';

import { useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Exercise, SetType } from '@prisma/client';
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { getExercises } from '@/app/actions/exercises';
import { createWorkout, updateWorkout, WorkoutWithSets } from '@/app/actions/workouts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const workoutSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  totalLength: z.number().min(0, 'Total length cannot be negative'),
  equipment: z.array(z.string()),
  muscleGroups: z.array(z.string()),
  sets: z.array(
    z.object({
      type: z.nativeEnum(SetType),
      rounds: z.number().min(1, 'Rounds must be at least 1'),
      rest: z.number().min(0, 'Rest time cannot be negative'),
      gap: z.number().min(0, 'Gap time cannot be negative').optional(),
      exercises: z.array(
        z.object({
          exerciseId: z.string().min(1, 'Exercise is required'),
          targetReps: z.number().min(1, 'Target reps must be at least 1'),
          order: z.number().min(1, 'Order must be at least 1'),
        }),
      ),
    }),
  ),
});

type WorkoutInput = z.infer<typeof workoutSchema>;

interface WorkoutFormProps {
  workout?: WorkoutWithSets | null;
}

export function WorkoutForm({ workout }: WorkoutFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [openSets, setOpenSets] = useState<Record<number, boolean>>({});

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<WorkoutInput>({
    resolver: zodResolver(workoutSchema),
    defaultValues: workout
      ? {
          name: workout.name,
          description: workout.description || '',
          totalLength: workout.totalLength,
          equipment: workout.equipment,
          muscleGroups: workout.muscleGroups,
          sets: workout.sets.map((set) => ({
            type: set.type,
            rounds: set.rounds,
            rest: set.rest,
            gap: set.gap || 0,
            exercises: set.exercises.map((exercise, index) => ({
              exerciseId: exercise.exerciseId,
              targetReps: exercise.targetReps,
              order: exercise.order || index + 1,
            })),
          })),
        }
      : {
          name: '',
          description: '',
          totalLength: 0,
          equipment: [],
          muscleGroups: [],
          sets: [
            {
              type: SetType.MULTISET,
              rounds: 1,
              rest: 0,
              exercises: [],
            },
          ],
        },
  });

  const {
    fields: setFields,
    append: appendSet,
    remove: removeSet,
    move: moveSet,
  } = useFieldArray({
    control,
    name: 'sets',
  });

  useEffect(() => {
    const loadExercises = async () => {
      const { exercises } = await getExercises(1, 1000);
      setExercises(exercises);
    };
    loadExercises();
  }, []);

  const onSubmit = async (data: WorkoutInput) => {
    try {
      const orderedData = {
        ...data,
        sets: data.sets.map((set) => ({
          ...set,
          exercises: set.exercises.map((exercise, index) => ({
            ...exercise,
            order: index + 1,
          })),
        })),
      };

      if (workout) {
        await updateWorkout(workout.id, orderedData);
        toast({ title: 'Workout updated successfully' });
      } else {
        await createWorkout(orderedData);
        toast({ title: 'Workout created successfully' });
      }
      router.push('/admin/content/workouts');
    } catch (error) {
      console.error(error);
      toast({ title: 'Error saving workout', variant: 'destructive' });
    }
  };

  const watchedSets = watch('sets');

  const { totalTime, equipment, muscleGroups } = useMemo(() => {
    let totalTime = 0;
    const equipmentSet = new Set<string>();
    const muscleGroupsSet = new Set<string>();

    watchedSets.forEach((set) => {
      const setTime =
        set.rounds *
          (set.exercises.reduce((acc, exercise) => {
            const exerciseData = exercises.find((e) => e.id === exercise.exerciseId);
            if (exerciseData) {
              exerciseData.muscleGroups.forEach((mg) => muscleGroupsSet.add(mg));
              if (exerciseData.equipment) equipmentSet.add(exerciseData.equipment);
            }
            return acc + exercise.targetReps * 3;
          }, 0) +
            (set.gap || 0)) +
        set.rest;

      totalTime += setTime;
    });

    exercises.forEach((exercise) => {
      if (watchedSets.some((set) => set.exercises.some((e) => e.exerciseId === exercise.id))) {
        if (exercise.equipment) {
          equipmentSet.add(exercise.equipment);
        }
        exercise.muscleGroups.forEach((mg) => muscleGroupsSet.add(mg));
      }
    });

    return {
      totalTime,
      equipment: Array.from(equipmentSet),
      muscleGroups: Array.from(muscleGroupsSet),
    };
  }, [watchedSets, exercises]);

  useEffect(() => {
    setValue('totalLength', totalTime);
    setValue('equipment', equipment);
    setValue('muscleGroups', Array.from(muscleGroups));
  }, [totalTime, equipment, muscleGroups, setValue]);

  const toggleSet = (index: number) => {
    setOpenSets((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const getMaxExercises = (setType: SetType) => {
    switch (setType) {
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

  const getSetTitle = (setIndex: number) => {
    const set = watchedSets[setIndex];
    const exerciseNames = set.exercises
      .map((exercise) => exercises.find((e) => e.id === exercise.exerciseId)?.name || 'Unknown')
      .join(', ');
    return `Set ${setIndex + 1}: ${exerciseNames}`;
  };

  const renderFormErrors = () => {
    const errorMessages = Object.entries(errors).flatMap(([key, value]) => {
      if (key === 'sets') {
        return (value as any[]).flatMap((setError, setIndex) =>
          Object.entries(setError || {}).map(([setKey, setValue]) => {
            if (setKey === 'exercises') {
              return ((setValue as any[]) || [])
                .map((exerciseError, exerciseIndex) => {
                  const firstError = Object.values(exerciseError || {})[0] as
                    | { message: string }
                    | undefined;
                  return firstError
                    ? `Set ${setIndex + 1}, Exercise ${exerciseIndex + 1}: ${firstError.message}`
                    : null;
                })
                .filter((message): message is string => message !== null);
            }
            return `Set ${setIndex + 1}: ${(setValue as { message: string })?.message || 'Unknown error'}`;
          }),
        );
      }
      return `${key}: ${(value as { message: string })?.message || 'Unknown error'}`;
    });

    if (errorMessages.length === 0) return null;

    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>There are errors in your form:</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-5">
            {errorMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );
  };

  const renderExerciseFields = (setIndex: number, exerciseIndex: number) => {
    const selectedExerciseId = watch(`sets.${setIndex}.exercises.${exerciseIndex}.exerciseId`);
    const selectedExercise = exercises.find((e) => e.id === selectedExerciseId);

    const getTargetLabel = () => {
      if (!selectedExercise) return 'Target';
      switch (selectedExercise.mode) {
        case 'TIME':
          return 'Target Time (seconds)';
        case 'DISTANCE':
          return 'Target Distance (meters)';
        default:
          return 'Target Reps';
      }
    };

    return (
      <Card key={exerciseIndex} className="mb-2">
        <CardContent className="flex items-center space-x-2 py-2">
          <div className="flex-1">
            <Label htmlFor={`sets.${setIndex}.exercises.${exerciseIndex}.exerciseId`}>
              Exercise
            </Label>
            <Controller
              name={`sets.${setIndex}.exercises.${exerciseIndex}.exerciseId`}
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    {exercises.map((exercise) => (
                      <SelectItem key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor={`sets.${setIndex}.exercises.${exerciseIndex}.targetReps`}>
              {getTargetLabel()}
            </Label>
            <Controller
              name={`sets.${setIndex}.exercises.${exerciseIndex}.targetReps`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  id={`sets.${setIndex}.exercises.${exerciseIndex}.targetReps`}
                  onChange={(e) => field.onChange(+e.target.value)}
                />
              )}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <Button
              type="button"
              onClick={() => {
                const exercises = watch(`sets.${setIndex}.exercises`);
                if (exerciseIndex > 0) {
                  const newExercises = [...exercises];
                  [newExercises[exerciseIndex - 1], newExercises[exerciseIndex]] = [
                    newExercises[exerciseIndex],
                    newExercises[exerciseIndex - 1],
                  ];
                  setValue(`sets.${setIndex}.exercises`, newExercises);
                }
              }}
              disabled={exerciseIndex === 0}
              variant="outline"
              size="sm"
            >
              <ArrowUp className="size-4" />
            </Button>
            <Button
              type="button"
              onClick={() => {
                const exercises = watch(`sets.${setIndex}.exercises`);
                if (exerciseIndex < exercises.length - 1) {
                  const newExercises = [...exercises];
                  [newExercises[exerciseIndex], newExercises[exerciseIndex + 1]] = [
                    newExercises[exerciseIndex + 1],
                    newExercises[exerciseIndex],
                  ];
                  setValue(`sets.${setIndex}.exercises`, newExercises);
                }
              }}
              disabled={exerciseIndex === watch(`sets.${setIndex}.exercises`).length - 1}
              variant="outline"
              size="sm"
            >
              <ArrowDown className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex h-[calc(100vh-100px)] flex-col gap-6">
      <div className="flex grow gap-6">
        <div className="flex w-1/3 flex-col space-y-6">
          <Card className="grow">
            <CardHeader>
              <CardTitle>Workout Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => <Input {...field} id="name" />}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => <Textarea {...field} id="description" />}
                />
              </div>

              <div>
                <Label>Total Time</Label>
                <p>
                  {Math.floor(totalTime / 60)} minutes {totalTime % 60} seconds
                </p>
              </div>

              <div>
                <Label>Equipment Needed</Label>
                <p>{equipment.join(', ') || 'None'}</p>
              </div>

              <div>
                <Label>Muscle Groups</Label>
                <p>{Array.from(muscleGroups).join(', ') || 'None'}</p>
              </div>
            </CardContent>
          </Card>
          <Button type="submit" className="w-full">
            Save Workout
          </Button>
        </div>

        <div className="w-2/3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Workout Structure</CardTitle>
            </CardHeader>
            <CardContent>
              {renderFormErrors()}

              <ScrollArea className="h-[calc(100vh-220px)] pr-4">
                {setFields.map((setField, setIndex) => (
                  <Collapsible
                    key={setField.id}
                    open={openSets[setIndex]}
                    onOpenChange={() => toggleSet(setIndex)}
                  >
                    <Card className="mb-4">
                      <CardHeader className="flex flex-row items-center justify-between p-2">
                        <CardTitle className="text-lg">{getSetTitle(setIndex)}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            onClick={() => removeSet(setIndex)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            onClick={() => moveSet(setIndex, setIndex - 1)}
                            disabled={setIndex === 0}
                            variant="outline"
                            size="sm"
                          >
                            <ArrowUp className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            onClick={() => moveSet(setIndex, setIndex + 1)}
                            disabled={setIndex === setFields.length - 1}
                            variant="outline"
                            size="sm"
                          >
                            <ArrowDown className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                              {openSets[setIndex] ? <ChevronUp /> : <ChevronDown />}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1">
                              <Label htmlFor={`sets.${setIndex}.type`}>Type</Label>
                              <Controller
                                name={`sets.${setIndex}.type`}
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      const maxExercises = getMaxExercises(value as SetType);
                                      const currentExercises = watch(`sets.${setIndex}.exercises`);
                                      if (currentExercises.length > maxExercises) {
                                        setValue(
                                          `sets.${setIndex}.exercises`,
                                          currentExercises.slice(0, maxExercises),
                                        );
                                      }
                                    }}
                                    value={field.value}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select set type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.values(SetType).map((type) => (
                                        <SelectItem key={type} value={type}>
                                          {type}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>
                            <div className="flex-1">
                              <Label htmlFor={`sets.${setIndex}.rounds`}>Sets</Label>
                              <Controller
                                name={`sets.${setIndex}.rounds`}
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="number"
                                    id={`sets.${setIndex}.rounds`}
                                    onChange={(e) => field.onChange(+e.target.value)}
                                  />
                                )}
                              />
                            </div>
                            <div className="flex-1">
                              <Label htmlFor={`sets.${setIndex}.rest`}>Rest (s)</Label>
                              <Controller
                                name={`sets.${setIndex}.rest`}
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="number"
                                    id={`sets.${setIndex}.rest`}
                                    onChange={(e) => field.onChange(+e.target.value)}
                                  />
                                )}
                              />
                            </div>
                            {watch(`sets.${setIndex}.type`) !== SetType.MULTISET && (
                              <div className="flex-1">
                                <Label htmlFor={`sets.${setIndex}.gap`}>Gap (s)</Label>
                                <Controller
                                  name={`sets.${setIndex}.gap`}
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      type="number"
                                      id={`sets.${setIndex}.gap`}
                                      onChange={(e) => field.onChange(+e.target.value)}
                                    />
                                  )}
                                />
                              </div>
                            )}
                          </div>

                          <div>
                            <h5 className="mb-2 font-medium">Exercises</h5>
                            {watch(`sets.${setIndex}.exercises`).map((exercise, exerciseIndex) =>
                              renderExerciseFields(setIndex, exerciseIndex),
                            )}
                            {watch(`sets.${setIndex}.exercises`).length <
                              getMaxExercises(watch(`sets.${setIndex}.type`)) && (
                              <Button
                                type="button"
                                onClick={() => {
                                  const exercises = watch(`sets.${setIndex}.exercises`);
                                  setValue(`sets.${setIndex}.exercises`, [
                                    ...exercises,
                                    {
                                      exerciseId: '',
                                      targetReps: 1,
                                      order: exercises.length + 1,
                                    },
                                  ]);
                                }}
                                variant="outline"
                                size="sm"
                                className="mt-2"
                              >
                                <Plus className="mr-2 size-4" />
                                Add Exercise
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
                <Button
                  type="button"
                  onClick={() =>
                    appendSet({
                      type: SetType.MULTISET,
                      rounds: 1,
                      rest: 0,
                      exercises: [],
                    })
                  }
                  variant="outline"
                >
                  <Plus className="mr-2 size-4" />
                  Add Set
                </Button>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
