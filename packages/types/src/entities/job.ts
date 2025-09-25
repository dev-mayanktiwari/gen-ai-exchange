import { z } from "zod";

// Job Status Enum
export const JobStatus = {
  QUEUED: "QUEUED",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type JobStatusType = keyof typeof JobStatus;

// Job Type Enum
export const JobType = {
  GENERATE_ASSETS: "GENERATE_ASSETS",
} as const;

export type JobTypeType = keyof typeof JobType;

// Job Schema
export const JobSchema = z.object({
  id: z.string(),
  productId: z.string(),
  type: z.enum(["GENERATE_ASSETS"]),
  status: z.enum(["QUEUED", "PROCESSING", "COMPLETED", "FAILED"]),
  step: z.string().optional(),
  error: z.string().optional(),
  createdAt: z.date(),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
});

// Type Exports
export type Job = z.infer<typeof JobSchema>;