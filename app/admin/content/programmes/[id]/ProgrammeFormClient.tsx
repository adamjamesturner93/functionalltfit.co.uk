"use client";

import { useEffect, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProgramme, updateProgramme } from "@/app/actions/programmes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { TypeaheadSelect } from "@/components/typeahead-select";
import {
  Programme,
  ProgrammeFormData,
  programmeSchema,
  Activity,
} from "@/lib/schemas/programme";

interface Workout {
  id: string;
  name: string;
}

interface YogaVideo {
  id: string;
  title: string;
}

interface ProgrammeFormClientProps {
  initialProgramme: Programme | null;
  workouts: Workout[];
  yogaVideos: YogaVideo[];
  id: string;
}

export default function ProgrammeFormClient({
  initialProgramme,
  workouts = [],
  yogaVideos = [],
  id,
}: ProgrammeFormClientProps) {
  const router = useRouter();
  const isNewProgramme = id === "new";
  const [sameAsWeekOne, setSameAsWeekOne] = useState(false);

  const defaultValues = useMemo(() => {
    if (initialProgramme) {
      return {
        ...initialProgramme,
        activities: initialProgramme.activities.map((activity) => ({
          week: activity.week,
          day: activity.day,
          activityType: activity.workoutId ? "WORKOUT" : "YOGA",
          workoutId: activity.workoutId,
          yogaVideoId: activity.yogaVideoId,
        })),
      };
    }
    return {
      title: "",
      description: "",
      thumbnail: "",
      sessionsPerWeek: 2,
      intention: "",
      weeks: 2,
      activities: [],
    };
  }, [initialProgramme]);

  const { control, handleSubmit, watch, setValue } = useForm<ProgrammeFormData>(
    {
      resolver: zodResolver(programmeSchema.omit({ id: true })),
      defaultValues,
    }
  );

  const { fields, replace } = useFieldArray({
    control,
    name: "activities",
  });

  const weeks = watch("weeks");
  const sessionsPerWeek = watch("sessionsPerWeek");

  const updateActivities = useCallback(
    (
      currentWeeks: number,
      currentSessionsPerWeek: number,
      currentFields: Activity[]
    ) => {
      const newActivities: Activity[] = [];
      for (let week = 1; week <= currentWeeks; week++) {
        for (let day = 1; day <= currentSessionsPerWeek; day++) {
          const existingActivity = currentFields.find(
            (f) => f.week === week && f.day === day
          );
          if (existingActivity) {
            newActivities.push(existingActivity);
          } else {
            newActivities.push({
              week,
              day,
              activityType: "WORKOUT",
              workoutId: null,
              yogaVideoId: null,
            });
          }
        }
      }
      return newActivities;
    },
    []
  );

  useEffect(() => {
    const newActivities = updateActivities(weeks, sessionsPerWeek, fields);
    if (JSON.stringify(newActivities) !== JSON.stringify(fields)) {
      replace(newActivities);
    }
  }, [weeks, sessionsPerWeek, updateActivities, fields, replace]);

  const onSubmit = async (data: ProgrammeFormData) => {
    try {
      if (isNewProgramme) {
        await createProgramme(data);
      } else {
        await updateProgramme(id, data);
      }
      router.push("/admin/content/programmes");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const workoutItems = useMemo(
    () =>
      workouts.map((workout) => ({
        id: workout.id,
        label: workout.name,
      })) || [],
    [workouts]
  );

  const yogaVideoItems = useMemo(
    () =>
      yogaVideos.map((yogaVideo) => ({
        id: yogaVideo.id,
        label: yogaVideo.title,
      })) || [],
    [yogaVideos]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isNewProgramme ? "Create New Programme" : "Edit Programme"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input id="title" {...field} />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Textarea id="description" {...field} />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <Label htmlFor="intention">Intention</Label>
            <Controller
              name="intention"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input id="intention" {...field} />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Thumbnail</Label>
            <Controller
              name="thumbnail"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <ImageUpload
                    onImageUpload={(url: string) => field.onChange(url)}
                    initialImage={field.value}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sessionsPerWeek">Sessions per Week</Label>
              <Controller
                name="sessionsPerWeek"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value.toString()}
                    >
                      <SelectTrigger id="sessionsPerWeek">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 5].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {error && (
                      <p className="text-red-500 text-sm mt-1">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div>
              <Label htmlFor="weeks">Number of Weeks</Label>
              <Controller
                name="weeks"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value.toString()}
                    >
                      <SelectTrigger id="weeks">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {error && (
                      <p className="text-red-500 text-sm mt-1">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Activities</h2>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sameAsWeekOne"
            checked={sameAsWeekOne}
            onCheckedChange={(checked) => setSameAsWeekOne(checked as boolean)}
          />
          <label
            htmlFor="sameAsWeekOne"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Make all weeks the same as week one
          </label>
        </div>
        {Array.from({ length: sameAsWeekOne ? 1 : weeks }).map(
          (_, weekIndex) => (
            <div
              key={weekIndex}
              className="border p-4 rounded-md bg-surface-grey"
            >
              <h3 className="text-lg font-medium mb-2">
                Week {sameAsWeekOne ? "All" : weekIndex + 1}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields
                  .filter((field) => field.week === weekIndex + 1)
                  .map((field) => {
                    const fieldIndex = fields.findIndex(
                      (f) => f.id === field.id
                    );
                    return (
                      <div key={field.id} className="space-y-2">
                        <span className="font-medium">Day {field.day}:</span>
                        <Controller
                          name={`activities.${fieldIndex}.activityType`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setValue(
                                  `activities.${fieldIndex}.workoutId`,
                                  null
                                );
                                setValue(
                                  `activities.${fieldIndex}.yogaVideoId`,
                                  null
                                );
                              }}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="WORKOUT">Workout</SelectItem>
                                <SelectItem value="YOGA">Yoga</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {watch(`activities.${fieldIndex}.activityType`) ===
                        "WORKOUT" ? (
                          <Controller
                            name={`activities.${fieldIndex}.workoutId`}
                            control={control}
                            render={({ field }) => (
                              <TypeaheadSelect
                                items={workoutItems}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select a workout"
                              />
                            )}
                          />
                        ) : (
                          <Controller
                            name={`activities.${fieldIndex}.yogaVideoId`}
                            control={control}
                            render={({ field }) => (
                              <TypeaheadSelect
                                items={yogaVideoItems}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select a yoga video"
                              />
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )
        )}
      </div>

      <Button type="submit">
        {isNewProgramme ? "Create Programme" : "Update Programme"}
      </Button>
    </form>
  );
}
