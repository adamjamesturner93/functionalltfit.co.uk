import { z } from "zod";

export const activityTypeEnum = z.enum(["WORKOUT", "YOGA"]);

export const activitySchema = z.object({
  id: z.string().optional(),
  week: z.number(),
  day: z.number(),
  activityType: activityTypeEnum,
  workoutId: z.string().nullable(),
  yogaVideoId: z.string().nullable(),
  programmeId: z.string().optional(),
});

export const programmeSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  thumbnail: z.string(),
  sessionsPerWeek: z.number(),
  intention: z.string(),
  weeks: z.number(),
  activities: z.array(activitySchema),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Activity = z.infer<typeof activitySchema>;
export type Programme = z.infer<typeof programmeSchema>;
export type ProgrammeFormData = Omit<
  Programme,
  "id" | "createdAt" | "updatedAt"
>;
