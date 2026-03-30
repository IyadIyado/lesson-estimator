import { z } from "zod/v4";

export const addActiveStudentSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  remaining_lessons: z.coerce.number().int().min(0).default(5),
});

export const updateActiveStudentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100).optional(),
  remaining_lessons: z.coerce.number().int().min(0).optional(),
});

export const removeStudentSchema = z.object({
  id: z.string().min(1),
});

export const addQueuedStudentSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

export const reorderQueueSchema = z.object({
  orderedIds: z.array(z.string().min(1)),
});

export const updateSettingsSchema = z.object({
  default_lessons: z.coerce.number().int().min(1),
});
