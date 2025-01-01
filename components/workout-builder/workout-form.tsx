'use client';

import { useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Exercise, ExerciseMode, SetType } from '@prisma/client';
import { Plus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';

import { createWorkout, updateWorkout, WorkoutWithSets } from '@/app/actions/workouts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

import { CooldownBuilder } from './cooldown-builder';
import { SetBuilder } from './set-builder';
import { WarmupBuilder } from './warmup-builder';
import { WorkoutOverview } from './workout-overview';
import { WorkoutPreview } from './workout-preview';

const workoutSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  totalLength: z.number().min(0, 'Total length cannot be negative'),
  equipment: z.array(z.string()),
  primaryMuscles: z.array(z.string()),
  warmup: z.array(
    z.object({
      exerciseId: z.string().min(1, 'Exercise is required'),
      duration: z.number().min(1, 'Duration must be at least 1 second'),
    }),
  ),
  cooldown: z.array(
    z.object({
      exerciseId: z.string().min(1, 'Exercise is required'),
      duration: z.number().min(1, 'Duration must be at least 1 second'),
    }),
  ),
  sets: z.array(
    z.object({
      type: z.nativeEnum(SetType),
      rounds: z.number().min(1, 'Rounds must be at least 1'),
      rest: z.number().min(0, 'Rest time cannot be negative'),
      gap: z.number().min(0, 'Gap time cannot be negative').optional(),
      exercises: z.array(
        z.object({
          exerciseId: z.string().min(1, 'Exercise is required'),
          mode: z.nativeEnum(ExerciseMode),
          targetReps: z.number().nullable(),
          targetTime: z.number().nullable(),
          targetDistance: z.number().nullable(),
          order: z.number().min(1, 'Order must be at least 1'),
        }),
      ),
    }),
  ),
});

type WorkoutFormData = z.infer<typeof workoutSchema>;

interface WorkoutFormProps {
  workout?: WorkoutWithSets | null;
  exercises: Exercise[];
}

export function WorkoutForm({ workout, exercises }: WorkoutFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');

  const methods = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: workout
      ? {
          name: workout.name,
          description: workout.description || '',
          totalLength: workout.totalLength,
          equipment: workout.equipment,
          primaryMuscles: workout.primaryMuscles,
          warmup: workout.warmup || [],
          cooldown: workout.cooldown || [],
          sets: workout.sets.map((set) => ({
            type: set.type,
            rounds: set.rounds,
            rest: set.rest,
            gap: set.gap || 0,
            exercises: set.exercises.map((exercise, index) => ({
              exerciseId: exercise.exerciseId,
              mode: exercise.mode,
              targetReps: exercise.targetReps,
              targetTime: exercise.targetTime,
              targetDistance: exercise.targetDistance,
              order: exercise.order || index + 1,
            })),
          })),
        }
      : {
          name: '',
          description: '',
          totalLength: 0,
          equipment: [],
          primaryMuscles: [],
          warmup: [],
          cooldown: [],
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
  } = useFieldArray({
    control: methods.control,
    name: 'sets',
  });

  const onSubmit = async (data: WorkoutFormData) => {
    try {
      // Calculate totalLength
      const totalLength = calculateTotalLength(data);

      // Gather unique equipment and primary muscles
      const uniqueEquipment = getUniqueEquipment(data, exercises);
      const uniquePrimaryMuscles = getUniquePrimaryMuscles(data, exercises);

      // Include calculated values and warmup/cooldown in the submission data
      const submissionData = {
        ...data,
        totalLength,
        equipment: uniqueEquipment,
        primaryMuscles: uniquePrimaryMuscles,
        sets: data.sets.map((set) => ({
          ...set,
          exercises: set.exercises.map((exercise) => ({
            exerciseId: exercise.exerciseId,
            mode: exercise.mode,
            targetReps: exercise.targetReps ?? 0,
            targetTime: exercise.targetTime ?? 0,
            targetDistance: exercise.targetDistance ?? 0,
            order: exercise.order,
          })),
        })),
      };

      if (workout) {
        await updateWorkout(workout.id, submissionData);
        toast({ title: 'Workout updated successfully' });
      } else {
        await createWorkout(submissionData);
        toast({ title: 'Workout created successfully' });
      }
      router.push('/admin/content/workouts');
    } catch (error) {
      console.error(error);
      toast({ title: 'Error saving workout', variant: 'destructive' });
    }
  };

  const calculateTotalLength = (data: WorkoutFormData): number => {
    let total = 0;

    // Add warmup time
    total += data.warmup.reduce((acc, exercise) => acc + exercise.duration, 0);

    // Add main workout time
    data.sets.forEach((set) => {
      const setTime = set.exercises.reduce((acc, exercise) => {
        switch (exercise.mode) {
          case ExerciseMode.REPS:
            return acc + (exercise.targetReps || 0) * 3; // Assuming 3 seconds per rep
          case ExerciseMode.TIME:
            return acc + (exercise.targetTime || 0);
          case ExerciseMode.DISTANCE:
            return acc + (exercise.targetDistance || 0) * 10; // Assuming 10 seconds per meter
          default:
            return acc;
        }
      }, 0);
      total += (setTime + set.rest) * set.rounds;
      if (set.type !== SetType.MULTISET) {
        total += (set.gap || 0) * (set.exercises.length - 1) * set.rounds;
      }
    });

    // Add cooldown time
    total += data.cooldown.reduce((acc, exercise) => acc + exercise.duration, 0);

    return total;
  };

  const getUniqueEquipment = (data: WorkoutFormData, exercises: Exercise[]): string[] => {
    const equipmentSet = new Set<string>();

    const addEquipment = (exerciseId: string) => {
      const exercise = exercises.find((e) => e.id === exerciseId);
      if (exercise) {
        exercise.equipment.forEach((eq) => equipmentSet.add(eq));
      }
    };

    data.warmup.forEach((exercise) => addEquipment(exercise.exerciseId));
    data.sets.forEach((set) =>
      set.exercises.forEach((exercise) => addEquipment(exercise.exerciseId)),
    );
    data.cooldown.forEach((exercise) => addEquipment(exercise.exerciseId));

    return Array.from(equipmentSet);
  };

  const getUniquePrimaryMuscles = (data: WorkoutFormData, exercises: Exercise[]): string[] => {
    const musclesSet = new Set<string>();

    const addMuscles = (exerciseId: string) => {
      const exercise = exercises.find((e) => e.id === exerciseId);
      if (exercise) {
        exercise.primaryMuscles.forEach((muscle) => musclesSet.add(muscle));
      }
    };

    data.warmup.forEach((exercise) => addMuscles(exercise.exerciseId));
    data.sets.forEach((set) =>
      set.exercises.forEach((exercise) => addMuscles(exercise.exerciseId)),
    );
    data.cooldown.forEach((exercise) => addMuscles(exercise.exerciseId));

    return Array.from(musclesSet);
  };

  const handleSetTypeChange = (index: number, newType: SetType) => {
    const currentSet = methods.getValues(`sets.${index}`);
    const newSet = { ...currentSet, type: newType };

    // Adjust exercises based on the new set type
    if (newType === SetType.MULTISET) {
      newSet.exercises = newSet.exercises.slice(0, 1);
    } else if (newType === SetType.SUPERSET) {
      newSet.exercises = newSet.exercises.slice(0, 2);
    } else if (newType === SetType.TRISET) {
      newSet.exercises = newSet.exercises.slice(0, 3);
    }
    // For CIRCUIT, we don't limit the number of exercises

    methods.setValue(`sets.${index}`, newSet);
  };

  if (!exercises || exercises.length === 0) {
    return (
      <div>
        <h1 className="mb-4 text-2xl font-bold">Error: No Exercises Available</h1>
        <p>Please add exercises to the database before creating or editing a workout.</p>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{workout ? 'Edit Workout' : 'Create New Workout'}</h1>
          <Button type="submit">
            <Save className="mr-2 size-4" />
            Save Workout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="warmup">Warm-up</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="cooldown">Cool-down</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Workout Details</CardTitle>
                <CardDescription>Basic information about your workout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input {...methods.register('name')} />
                  {methods.formState.errors.name && (
                    <span className="text-sm text-destructive">
                      {methods.formState.errors.name.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea {...methods.register('description')} className="min-h-[100px]" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="structure" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Workout Structure</CardTitle>
                <CardDescription>Build your workout by adding sets and exercises</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {setFields.map((field, index) => (
                  <SetBuilder
                    key={field.id}
                    setIndex={index}
                    exercises={exercises}
                    onSetTypeChange={(newType) => handleSetTypeChange(index, newType)}
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendSet({
                      type: SetType.MULTISET,
                      rounds: 1,
                      rest: 60,
                      exercises: [],
                    })
                  }
                >
                  <Plus className="mr-2 size-4" />
                  Add Set
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="warmup">
            <WarmupBuilder exercises={exercises} />
          </TabsContent>

          <TabsContent value="cooldown">
            <CooldownBuilder exercises={exercises} />
          </TabsContent>

          <TabsContent value="preview">
            <WorkoutPreview
              warmup={methods.watch('warmup')}
              sets={methods.watch('sets')}
              cooldown={methods.watch('cooldown')}
              exercises={exercises}
            />
          </TabsContent>

          <TabsContent value="overview">
            <WorkoutOverview
              warmup={methods.watch('warmup')}
              sets={methods.watch('sets')}
              cooldown={methods.watch('cooldown')}
              exercises={exercises}
            />
          </TabsContent>
        </Tabs>
      </form>
    </FormProvider>
  );
}
