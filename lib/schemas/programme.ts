import { z } from "zod";

export const activitySchema = z.object({
  week: z.number().int().min(1),
  day: z.number().int().min(1),
  activityType: z.enum(["WORKOUT", "YOGA"]),
  workoutId: z.string().nullable(),
  yogaVideoId: z.string().nullable(),
});

export const programmeSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.string().url("Invalid thumbnail URL"),
  sessionsPerWeek: z.number().int().min(2).max(5),
  intention: z.string().min(1, "Intention is required"),
  weeks: z.number().int().min(2).max(8),
  activities: z.array(activitySchema),
});

export type Activity = z.infer<typeof activitySchema>;
export type Programme = z.infer<typeof programmeSchema>;
export type ProgrammeFormData = Omit<Programme, "id">;
