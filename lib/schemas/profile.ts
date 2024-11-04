import { Unit } from "@prisma/client";
import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or less"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  lengthUnit: z.nativeEnum(Unit),
  weightUnit: z.nativeEnum(Unit),
  image: z.string().optional(),
});
