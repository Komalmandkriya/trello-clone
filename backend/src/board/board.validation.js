import { z } from "zod";

export const createBoardValidation = z.object({
  workspaceId: z.string().min(1, "Workspace ID is required"),

  name: z
    .string()
    .trim()
    .min(2, "Board name must be at least 2 characters")
    .max(100),

  description: z.string().trim().max(500).optional().or(z.literal("")),
});

export const updateBoardValidation = z.object({
  name: z.string().trim().min(2).max(100).optional(),

  description: z.string().trim().max(500).optional(),
});
