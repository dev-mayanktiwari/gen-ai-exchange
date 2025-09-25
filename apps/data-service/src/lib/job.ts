export type JobStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface Job {
  id: string;
  productId: string;
  type: "GENERATE_ASSETS";
  status: JobStatus;
  step?: string;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}
