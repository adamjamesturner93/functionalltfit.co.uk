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
  primaryMuscles: z.array(z.string()).min(1, 'At least one muscle group is required'),
  secondaryMuscles: z.array(z.string()),
  equipment: z.array(z.string()),
  muscleGroupCategories: z.array(z.string()),
  contraindications: z.array(z.string()),
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

const primaryMuscles = [
  { label: 'Abs', value: 'Abs' },
  { label: 'Adductors', value: 'Adductors' },
  { label: 'Ankles', value: 'Ankles' },
  { label: 'Biceps', value: 'Biceps' },
  { label: 'Calves', value: 'Calves' },
  { label: 'Chest', value: 'Chest' },
  { label: 'Core', value: 'Core' },
  { label: 'Forearms', value: 'Forearms' },
  { label: 'Front Deltoids', value: 'Front Deltoids' },
  { label: 'Full Body', value: 'Full Body' },
  { label: 'Glutes', value: 'Glutes' },
  { label: 'Hamstrings', value: 'Hamstrings' },
  { label: 'Hip Flexors', value: 'Hip Flexors' },
  { label: 'Hips', value: 'Hips' },
  { label: 'Inner Thighs', value: 'Inner Thighs' },
  { label: 'Lats', value: 'Lats' },
  { label: 'Lower Abs', value: 'Lower Abs' },
  { label: 'Lower Back', value: 'Lower Back' },
  { label: 'Obliques', value: 'Obliques' },
  { label: 'Quadriceps', value: 'Quadriceps' },
  { label: 'Rear Deltoids', value: 'Rear Deltoids' },
  { label: 'Rotator Cuff', value: 'Rotator Cuff' },
  { label: 'Serratus Anterior', value: 'Serratus Anterior' },
  { label: 'Shoulders', value: 'Shoulders' },
  { label: 'Spine', value: 'Spine' },
  { label: 'Trapezius', value: 'Trapezius' },
  { label: 'Triceps', value: 'Triceps' },
  { label: 'Upper Back', value: 'Upper Back' },
  { label: 'Upper Chest', value: 'Upper Chest' },
  { label: 'Wrists', value: 'Wrists' },
];

const equipment = [
  { label: 'Ab Wheel', value: 'Ab Wheel' },
  { label: 'Assisted Pull-up Machine', value: 'Assisted Pull-up Machine' },
  { label: 'Barbell', value: 'Barbell' },
  { label: 'Battle Ropes', value: 'Battle Ropes' },
  { label: 'Bench', value: 'Bench' },
  { label: 'Box', value: 'Box' },
  { label: 'Cable Machine', value: 'Cable Machine' },
  { label: 'Calf Raise Machine', value: 'Calf Raise Machine' },
  { label: 'Chest Fly Machine', value: 'Chest Fly Machine' },
  { label: 'Chest Press Machine', value: 'Chest Press Machine' },
  { label: 'Dumbbell', value: 'Dumbbell' },
  { label: 'EZ Bar', value: 'EZ Bar' },
  { label: 'Foam Roller', value: 'Foam Roller' },
  { label: 'Hack Squat Machine', value: 'Hack Squat Machine' },
  { label: 'Incline Bench', value: 'Incline Bench' },
  { label: 'Kettlebell', value: 'Kettlebell' },
  { label: 'Landmine Attachment', value: 'Landmine Attachment' },
  { label: 'Lat Pulldown Machine', value: 'Lat Pulldown Machine' },
  { label: 'Leg Curl Machine', value: 'Leg Curl Machine' },
  { label: 'Leg Extension Machine', value: 'Leg Extension Machine' },
  { label: 'Leg Press Machine', value: 'Leg Press Machine' },
  { label: 'Medicine Ball', value: 'Medicine Ball' },
  { label: 'Pad for Ankles', value: 'Pad for Ankles' },
  { label: 'Parallel Bars', value: 'Parallel Bars' },
  { label: 'Pec Deck Machine', value: 'Pec Deck Machine' },
  { label: 'Platform or Weight Plate', value: 'Platform or Weight Plate' },
  { label: 'Plyo Box', value: 'Plyo Box' },
  { label: 'Power Rack', value: 'Power Rack' },
  { label: 'Preacher Bench', value: 'Preacher Bench' },
  { label: 'Pull-up Bar', value: 'Pull-up Bar' },
  { label: 'Raised Platform', value: 'Raised Platform' },
  { label: 'Resistance Band', value: 'Resistance Band' },
  { label: 'Reverse Fly Machine', value: 'Reverse Fly Machine' },
  { label: 'Rowing Machine', value: 'Rowing Machine' },
  { label: 'Seated Calf Raise Machine', value: 'Seated Calf Raise Machine' },
  { label: 'Seated Leg Curl Machine', value: 'Seated Leg Curl Machine' },
  { label: 'Seated Row Machine', value: 'Seated Row Machine' },
  { label: 'Shoulder Press Machine', value: 'Shoulder Press Machine' },
  { label: 'Ski Erg Machine', value: 'Ski Erg Machine' },
  { label: 'Step or Platform', value: 'Step or Platform' },
  { label: 'Straight Bar Attachment', value: 'Straight Bar Attachment' },
  { label: 'TRX Suspension Trainer', value: 'TRX Suspension Trainer' },
  { label: 'Trap Bar', value: 'Trap Bar' },
  { label: 'Wobbleboard', value: 'Wobbleboard' },
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
      primaryMuscles: [],
      secondaryMuscles: [],
      muscleGroupCategories: [],
      contraindications: [],
      equipment: [],
      type: ExerciseType.STRENGTH,
      mode: ExerciseMode.REPS,
      instructions: '',
      thumbnailUrl: './image.png',
      videoUrl: './video.mp4',
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
                <Label htmlFor="primaryMuscles">Muscle Groups</Label>
                <Controller
                  name="primaryMuscles"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      options={primaryMuscles}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Select muscle groups"
                    />
                  )}
                />
                {errors.primaryMuscles && (
                  <p className="text-sm text-red-500">{errors.primaryMuscles.message}</p>
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
                    <MultiSelect
                      options={equipment}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Select equipment groups"
                    />
                  )}
                />
                {errors.equipment && (
                  <p className="text-sm text-red-500">{errors.equipment.message}</p>
                )}
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

          {/* <div className="mt-6 space-y-4">
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
          </div> */}
        </CardContent>
      </Card>

      <Button type="submit">Save Exercise</Button>
    </form>
  );
}
