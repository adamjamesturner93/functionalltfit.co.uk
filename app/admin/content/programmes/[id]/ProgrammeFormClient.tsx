'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Control, Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Workout, YogaVideo } from '@prisma/client';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import {
  createProgramme,
  ProgrammeWithActivitiesAndSaved,
  updateProgramme,
} from '@/app/actions/programmes';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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

const activitySchema = z.object({
  id: z.string().optional(),
  week: z.number().min(1, 'Week must be at least 1'),
  day: z.number().min(1, 'Day must be at least 1'),
  activityType: z.enum(['WORKOUT', 'YOGA']),
  workoutId: z.string().nullable(),
  yogaVideoId: z.string().nullable(),
});

const programmeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  thumbnail: z.string().min(1, 'Thumbnail URL is required'),
  sessionsPerWeek: z.number().min(1, 'Sessions per week must be at least 1'),
  intention: z.string().min(1, 'Intention is required'),
  weeks: z.number().min(1, 'Number of weeks must be at least 1'),
  activities: z.array(activitySchema),
});

type ProgrammeInput = z.infer<typeof programmeSchema>;

interface ProgrammeFormProps {
  initialProgramme: ProgrammeWithActivitiesAndSaved | null;
  workouts: Workout[];
  yogaVideos: YogaVideo[];
  id: string;
}

interface ActivityFieldProps {
  activityIndex: number;
  control: Control<ProgrammeInput>;
  workouts: Workout[];
  yogaVideos: YogaVideo[];
  remove: (index: number) => void;
}

const ActivityField: React.FC<ActivityFieldProps> = React.memo(
  ({ activityIndex, control, workouts, yogaVideos, remove }) => {
    return (
      <Card className="mb-2">
        <CardContent className="flex items-center space-x-2 py-2">
          <div className="flex-1">
            <Label htmlFor={`activities.${activityIndex}.day`}>Day</Label>
            <Controller
              name={`activities.${activityIndex}.day`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  id={`activities.${activityIndex}.day`}
                  onChange={(e) => field.onChange(+e.target.value)}
                />
              )}
            />
          </div>

          <div className="flex-1">
            <Label htmlFor={`activities.${activityIndex}.activityType`}>Type</Label>
            <Controller
              name={`activities.${activityIndex}.activityType`}
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WORKOUT">Workout</SelectItem>
                    <SelectItem value="YOGA">Yoga</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex-1">
            <Label htmlFor={`activities.${activityIndex}.workoutId`}>Activity</Label>
            <Controller
              name={`activities.${activityIndex}.activityType`}
              control={control}
              render={({ field: activityTypeField }) => (
                <>
                  {activityTypeField.value === 'WORKOUT' && (
                    <Controller
                      name={`activities.${activityIndex}.workoutId`}
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select workout" />
                          </SelectTrigger>
                          <SelectContent>
                            {workouts.map((workout) => (
                              <SelectItem key={workout.id} value={workout.id}>
                                {workout.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}
                  {activityTypeField.value === 'YOGA' && (
                    <Controller
                      name={`activities.${activityIndex}.yogaVideoId`}
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select yoga video" />
                          </SelectTrigger>
                          <SelectContent>
                            {yogaVideos.map((video) => (
                              <SelectItem key={video.id} value={video.id}>
                                {video.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}
                </>
              )}
            />
          </div>

          <Button
            type="button"
            onClick={() => remove(activityIndex)}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="size-4" />
          </Button>
        </CardContent>
      </Card>
    );
  },
);

ActivityField.displayName = 'ActivityField';

const areAllWeeksSame = (activities: ProgrammeWithActivitiesAndSaved['activities']) => {
  const weekGroups = activities.reduce(
    (acc, activity) => {
      if (!acc[activity.week]) acc[activity.week] = [];
      acc[activity.week].push(activity);
      return acc;
    },
    {} as Record<number, typeof activities>,
  );

  const weeks = Object.values(weekGroups);
  if (weeks.length <= 1) return true;

  const firstWeek = JSON.stringify(
    weeks[0].map((a) => ({
      activityType: a.activityType,
      workoutId: a.workoutId,
      yogaVideoId: a.yogaVideoId,
    })),
  );
  return weeks.every(
    (week) =>
      JSON.stringify(
        week.map((a) => ({
          activityType: a.activityType,
          workoutId: a.workoutId,
          yogaVideoId: a.yogaVideoId,
        })),
      ) === firstWeek,
  );
};

export default function ProgrammeForm({
  initialProgramme,
  workouts,
  yogaVideos,
  id,
}: ProgrammeFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useCustomWeeks, setUseCustomWeeks] = useState(() =>
    initialProgramme ? !areAllWeeksSame(initialProgramme.activities) : false,
  );
  const [openWeeks, setOpenWeeks] = useState<Record<number, boolean>>({});

  const defaultValues: ProgrammeInput = useMemo(
    () =>
      initialProgramme
        ? {
            ...initialProgramme,
            activities: initialProgramme.activities.map((activity) => ({
              id: activity.id,
              week: activity.week,
              day: activity.day,
              activityType: activity.activityType as 'WORKOUT' | 'YOGA',
              workoutId: activity.workoutId,
              yogaVideoId: activity.yogaVideoId,
            })),
          }
        : {
            title: '',
            description: '',
            thumbnail: '',
            sessionsPerWeek: 3,
            intention: '',
            weeks: 4,
            activities: [],
          },
    [initialProgramme],
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProgrammeInput>({
    resolver: zodResolver(programmeSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialProgramme) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        setValue(key as keyof ProgrammeInput, value);
      });
    }
  }, [initialProgramme, setValue, defaultValues]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'activities',
  });

  const watchedActivities = watch('activities');
  const watchedWeeks = watch('weeks');
  const watchedSessionsPerWeek = watch('sessionsPerWeek');

  const updateActivities = useMemo(() => {
    if (watchedActivities.length === 0) return [];

    const sessionsPerWeek = watchedSessionsPerWeek;
    const weeks = watchedWeeks;

    if (!useCustomWeeks) {
      const weekOneActivities = watchedActivities
        .filter((activity) => activity.week === 1)
        .slice(0, sessionsPerWeek);
      return Array.from({ length: weeks }, (_, weekIndex) =>
        weekOneActivities.map((activity, dayIndex) => ({
          ...activity,
          week: weekIndex + 1,
          day: dayIndex + 1,
        })),
      ).flat();
    } else {
      return Array.from({ length: weeks }, (_, weekIndex) =>
        Array.from({ length: sessionsPerWeek }, (_, dayIndex) => {
          const existingActivity = watchedActivities.find(
            (a) => a.week === weekIndex + 1 && a.day === dayIndex + 1,
          );
          return (
            existingActivity || {
              week: weekIndex + 1,
              day: dayIndex + 1,
              activityType: 'WORKOUT' as const,
              workoutId: null,
              yogaVideoId: null,
            }
          );
        }),
      ).flat();
    }
  }, [useCustomWeeks, watchedWeeks, watchedSessionsPerWeek, watchedActivities]);

  useEffect(() => {
    if (JSON.stringify(watchedActivities) !== JSON.stringify(updateActivities)) {
      setValue('activities', updateActivities);
    }
  }, [updateActivities, setValue, watchedActivities]);

  const replicateWeekOneActivities = (data: ProgrammeInput): ProgrammeInput => {
    if (useCustomWeeks) return data;

    const weekOneActivities = data.activities.filter((activity) => activity.week === 1);
    const replicatedActivities = Array.from({ length: data.weeks }, (_, weekIndex) =>
      weekOneActivities.map((activity) => ({
        ...activity,
        week: weekIndex + 1,
        id: undefined,
      })),
    ).flat();

    return {
      ...data,
      activities: replicatedActivities,
    };
  };

  const onSubmit = async (data: ProgrammeInput) => {
    setIsSubmitting(true);
    try {
      const submissionData = replicateWeekOneActivities(data);
      if (id === 'new') {
        await createProgramme(submissionData);
      } else {
        await updateProgramme(id, submissionData);
      }
      toast({ title: 'Programme saved successfully' });
      router.push('/admin/content/programmes');
    } catch (error) {
      console.error('Error submitting programme:', error);
      toast({ title: 'Error saving programme', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateEquipment = useMemo(() => {
    const equipmentSet = new Set<string>();
    watchedActivities.forEach((activity) => {
      if (activity.activityType === 'WORKOUT' && activity.workoutId) {
        const workout = workouts.find((w) => w.id === activity.workoutId);
        if (workout) {
          workout.equipment.forEach((item) => equipmentSet.add(item));
        }
      }
    });
    return Array.from(equipmentSet);
  }, [watchedActivities, workouts]);

  const toggleWeek = useCallback((weekNumber: number) => {
    setOpenWeeks((prev) => ({ ...prev, [weekNumber]: !prev[weekNumber] }));
  }, []);

  const renderFormErrors = () => {
    const errorMessages = Object.entries(errors).flatMap(([key, value]) => {
      if (key === 'activities') {
        return (value as any[]).flatMap((activityError: any, activityIndex) =>
          Object.entries(activityError || {}).map(
            ([activityKey, activityValue]) =>
              `Activity ${activityIndex + 1}: ${(activityValue as { message: string })?.message || 'Unknown error'}`,
          ),
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

  const renderActivityFields = useCallback(
    (weekNumber: number, fields: Record<'id', string>[]) => {
      const weekActivities = fields.filter(
        (field, index) => watchedActivities[index]?.week === weekNumber,
      );

      return weekActivities.map((field, index) => {
        const activityIndex = fields.findIndex((f) => f.id === field.id);
        return (
          <ActivityField
            key={field.id}
            activityIndex={activityIndex}
            control={control}
            workouts={workouts}
            yogaVideos={yogaVideos}
            remove={remove}
          />
        );
      });
    },
    [watchedActivities, control, workouts, yogaVideos, remove],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Programme Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input id="thumbnail" {...register('thumbnail')} />
            {errors.thumbnail && <p className="text-sm text-red-500">{errors.thumbnail.message}</p>}
          </div>

          <div>
            <Label htmlFor="sessionsPerWeek">Sessions per week</Label>
            <Input
              id="sessionsPerWeek"
              type="number"
              {...register('sessionsPerWeek', { valueAsNumber: true })}
            />
            {errors.sessionsPerWeek && (
              <p className="text-sm text-red-500">{errors.sessionsPerWeek.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="intention">Intention</Label>
            <Input id="intention" {...register('intention')} />
            {errors.intention && <p className="text-sm text-red-500">{errors.intention.message}</p>}
          </div>

          <div>
            <Label htmlFor="weeks">Number of weeks</Label>
            <Input id="weeks" type="number" {...register('weeks', { valueAsNumber: true })} />
            {errors.weeks && <p className="text-sm text-red-500">{errors.weeks.message}</p>}
          </div>

          <div>
            <Label htmlFor="useCustomWeeks">
              <Checkbox
                id="useCustomWeeks"
                checked={useCustomWeeks}
                onCheckedChange={(checked) => setUseCustomWeeks(checked as boolean)}
              />
              <span className="ml-2">Customize weeks individually</span>
            </Label>
          </div>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {useCustomWeeks
                ? 'Each week can be customized individually'
                : 'All weeks will follow the same structure as Week 1'}
            </p>
          </div>
          <div>
            <Label>Equipment Needed</Label>
            <p>{calculateEquipment.join(', ') || 'None'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Programme Structure</CardTitle>
        </CardHeader>
        <CardContent>
          {renderFormErrors()}

          <ScrollArea className="h-[calc(100vh-400px)] pr-4">
            {Array.from(
              { length: useCustomWeeks ? watchedWeeks : 1 },
              (_, weekIndex) => weekIndex + 1,
            ).map((weekNumber) => (
              <Collapsible
                key={weekNumber}
                open={openWeeks[weekNumber]}
                onOpenChange={() => toggleWeek(weekNumber)}
              >
                <Card className="mb-4">
                  <CardHeader className="flex flex-row items-center justify-between p-2">
                    <CardTitle className="text-lg">Week {weekNumber}</CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {openWeeks[weekNumber] ? <ChevronUp /> : <ChevronDown />}
                      </Button>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      {renderActivityFields(weekNumber, fields)}
                      {useCustomWeeks && (
                        <Button
                          type="button"
                          onClick={() =>
                            append({
                              week: weekNumber,
                              day:
                                watchedActivities.filter((a) => a.week === weekNumber).length + 1,
                              activityType: 'WORKOUT',
                              workoutId: null,
                              yogaVideoId: null,
                            })
                          }
                          variant="outline"
                          size="sm"
                          className="mt-2"
                        >
                          <Plus className="mr-2 size-4" />
                          Add Activity
                        </Button>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Saving...' : 'Save Programme'}
      </Button>
    </form>
  );
}
