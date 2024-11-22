'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Exercise, ExerciseMode, ExerciseType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { createExercise, updateExercise } from '@/app/actions/exercises';
import { ImageUpload } from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { VideoUpload } from '@/components/video-upload';
import { useToast } from '@/hooks/use-toast';

const exerciseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  muscleGroups: z.array(z.string()).min(1, 'At least one muscle group is required'),
  equipment: z.string().min(1, 'Equipment is required'),
  type: z.nativeEnum(ExerciseType),
  mode: z.nativeEnum(ExerciseMode),
  instructions: z.string().min(1, 'Instructions are required'),
  thumbnailUrl: z.string().min(1, 'Thumbnail image is required'),
  videoUrl: z.string().min(1, 'Video is required'),
});

type ExerciseInput = z.infer<typeof exerciseSchema>;

interface ExerciseFormProps {
  exercise?: Exercise | null;
}

const muscleGroups = [
  { label: 'Chest', value: 'Chest' },
  { label: 'Back', value: 'Back' },
  { label: 'Shoulders', value: 'Shoulders' },
  { label: 'Biceps', value: 'Biceps' },
  { label: 'Triceps', value: 'Triceps' },
  { label: 'Legs', value: 'Legs' },
  { label: 'Core', value: 'Core' },
  { label: 'Full Body', value: 'Full Body' },
];

const equipmentOptions = [
  'None',
  'Dumbbells',
  'Barbell',
  'Kettlebell',
  'Resistance Bands',
  'Bodyweight',
  'Machine',
  'Other',
];

export function ExerciseForm({ exercise }: ExerciseFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseInput>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: exercise || {
      name: '',
      description: '',
      muscleGroups: [],
      equipment: 'None',
      type: ExerciseType.STRENGTH,
      mode: ExerciseMode.REPS,
      instructions: '',
      thumbnailUrl: '',
      videoUrl: '',
    },
  });

  const onSubmit = async (data: ExerciseInput) => {
    try {
      if (exercise) {
        await updateExercise(exercise.id, data);
        toast({ title: 'Exercise updated successfully' });
      } else {
        await createExercise(data);
        toast({ title: 'Exercise created successfully' });
      }
      router.push('/admin/content/exercises');
    } catch (error) {
      console.error(error);
      toast({ title: 'Error saving exercise', variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exercise Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => <Input {...field} id="name" />}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="muscleGroups">Muscle Groups</Label>
                <Controller
                  name="muscleGroups"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      options={muscleGroups}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Select muscle groups"
                    />
                  )}
                />
                {errors.muscleGroups && (
                  <p className="text-sm text-red-500">{errors.muscleGroups.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exercise type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ExerciseType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="mode">Mode</Label>
                <Controller
                  name="mode"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exercise mode" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ExerciseMode).map((mode) => (
                          <SelectItem key={mode} value={mode}>
                            {mode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="equipment">Equipment</Label>
                <Controller
                  name="equipment"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select equipment" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentOptions.map((equipment) => (
                          <SelectItem key={equipment} value={equipment}>
                            {equipment}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.equipment && (
                  <p className="text-sm text-red-500">{errors.equipment.message}</p>
                )}
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
                <Label htmlFor="instructions">Instructions</Label>
                <Controller
                  name="instructions"
                  control={control}
                  render={({ field }) => <Textarea {...field} id="instructions" />}
                />
                {errors.instructions && (
                  <p className="text-sm text-red-500">{errors.instructions.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="thumbnailUrl">Thumbnail Image</Label>
              <Controller
                name="thumbnailUrl"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    onImageUpload={(url) => field.onChange(url)}
                    initialImage={field.value}
                  />
                )}
              />
              {errors.thumbnailUrl && (
                <p className="text-sm text-red-500">{errors.thumbnailUrl.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="videoUrl">Video</Label>
              <Controller
                name="videoUrl"
                control={control}
                render={({ field }) => (
                  <VideoUpload
                    onVideoUpload={(url) => field.onChange(url)}
                    initialVideo={field.value}
                  />
                )}
              />
              {errors.videoUrl && <p className="text-sm text-red-500">{errors.videoUrl.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit">Save Exercise</Button>
    </form>
  );
}
