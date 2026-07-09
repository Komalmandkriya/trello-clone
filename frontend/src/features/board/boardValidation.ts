import { z } from "zod";

export const createBoardSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Board name must be at least 2 characters")
    .max(100, "Board name cannot exceed 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

export const updateBoardSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Board name must be at least 2 characters")
    .max(100)
    .optional(),
  description: z.string().trim().max(500).optional(),
});

export type CreateBoardFormValues = z.infer<typeof createBoardSchema>;
export type UpdateBoardFormValues = z.infer<typeof updateBoardSchema>;
