import { v4 as uuidV4 } from "uuid";
import { getFirestoreDb } from "../lib/firestore";
import { Job } from "@workspace/types";

export const JobService = {
  async createJob(
    productId: string,
    type: "GENERATE_ASSETS" = "GENERATE_ASSETS"
  ) {
    const db = getFirestoreDb();
    const jobId = `job_${uuidV4().split("-")[0]}`;

    const jobData: Job = {
      id: jobId,
      productId,
      type,
      status: "QUEUED",
      createdAt: new Date(),
    };

    await db.collection("jobs").doc(jobId).set(jobData);
    return jobData;
  },
};
