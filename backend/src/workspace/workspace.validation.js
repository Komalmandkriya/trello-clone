import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Workspace name must be at least 2 characters")
    .max(100, "Workspace name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

export const updateWorkspaceSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Workspace name must be at least 2 characters")
      .max(100, "Workspace name cannot exceed 100 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),

    visibility: z.enum(["private", "public"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
