import { JobStatusType, JobTypeType } from "../entities";
import { THTTPResponse } from "../http";

export type Job = {
  id: string;
  productId: string;
  type: JobTypeType;
  status: JobStatusType;
  createdAt: string;
};

export type UploadCompleteDataResponse = {
  jobId: Job;
  messageId: string;
};

export type UploadCompleteResponse = THTTPResponse<UploadCompleteDataResponse>;
