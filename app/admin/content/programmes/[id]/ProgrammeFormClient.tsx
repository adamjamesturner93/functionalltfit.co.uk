'use client';

import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Workout, YogaVideo } from '@prisma/client';
import { useRouter } from 'next/navigation';

import { ProgrammeWithActivitiesAndSaved } from '@/app/actions/programmes';
import { createProgramme, updateProgramme } from '@/app/actions/programmes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Programme, programmeSchema } from '@/lib/schemas/programme';

interface ProgrammeFormClientProps {
  initialProgramme: ProgrammeWithActivitiesAndSaved | null;
  workouts: Workout[];
  yogaVideos: YogaVideo[];
  id: string;
}

export default function ProgrammeFormClient({
  initialProgramme,
  workouts,
  yogaVideos,
  id,
}: ProgrammeFormClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Transform initialProgramme to match the expected Programme type
  const transformedInitialProgramme: Programme | null = initialProgramme
    ? {
        ...initialProgramme,
        activities: initialProgramme.activities.map((activity) => ({
          id: activity.id,
          week: activity.week,
          day: activity.day,
          activityType: activity.activityType as 'WORKOUT' | 'YOGA',
          workoutId: activity.workout?.id || null,
          yogaVideoId: activity.yogaVideo?.id || null,
        })),
      }
    : null;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Programme>({
    resolver: zodResolver(programmeSchema),
    defaultValues: transformedInitialProgramme || {
      title: '',
      description: '',
      thumbnail: '',
      sessionsPerWeek: 0,
      intention: '',
      weeks: 0,
      activities: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'activities',
  });

  const onSubmit = async (data: Programme) => {
    setIsSubmitting(true);
    try {
      if (id === 'new') {
        await createProgramme(data);
      } else {
        await updateProgramme(id, data);
      }
      router.push('/admin/content/programmes');
    } catch (error) {
      console.error('Error submitting programme:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Input {...register('title')} placeholder="Title" />
      {errors.title && <span>{errors.title.message}</span>}

      <Textarea {...register('description')} placeholder="Description" />
      {errors.description && <span>{errors.description.message}</span>}

      <Input {...register('thumbnail')} placeholder="Thumbnail URL" />
      {errors.thumbnail && <span>{errors.thumbnail.message}</span>}

      <Input
        {...register('sessionsPerWeek', { valueAsNumber: true })}
        type="number"
        placeholder="Sessions per week"
      />
      {errors.sessionsPerWeek && <span>{errors.sessionsPerWeek.message}</span>}

      <Input {...register('intention')} placeholder="Intention" />
      {errors.intention && <span>{errors.intention.message}</span>}

      <Input
        {...register('weeks', { valueAsNumber: true })}
        type="number"
        placeholder="Number of weeks"
      />
      {errors.weeks && <span>{errors.weeks.message}</span>}

      <div>
        <h3>Activities</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2">
            <Input
              {...register(`activities.${index}.week` as const, { valueAsNumber: true })}
              type="number"
              placeholder="Week"
            />
            <Input
              {...register(`activities.${index}.day` as const, { valueAsNumber: true })}
              type="number"
              placeholder="Day"
            />
            <Select {...register(`activities.${index}.activityType` as const)}>
              <option value="WORKOUT">Workout</option>
              <option value="YOGA">Yoga</option>
            </Select>
            <Select
              {...register(`activities.${index}.workoutId` as const)}
              disabled={field.activityType === 'YOGA'}
            >
              <option value="">Select a workout</option>
              {workouts.map((workout) => (
                <option key={workout.id} value={workout.id}>
                  {workout.name}
                </option>
              ))}
            </Select>
            <Select
              {...register(`activities.${index}.yogaVideoId` as const)}
              disabled={field.activityType === 'WORKOUT'}
            >
              <option value="">Select a yoga video</option>
              {yogaVideos.map((video) => (
                <option key={video.id} value={video.id}>
                  {video.title}
                </option>
              ))}
            </Select>
            <Button type="button" onClick={() => remove(index)}>
              Remove Activity
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() =>
            append({ week: 1, day: 1, activityType: 'WORKOUT', workoutId: null, yogaVideoId: null })
          }
        >
          Add Activity
        </Button>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
}
