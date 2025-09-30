import { ProductStatusType } from "../entities";
import { THTTPResponse } from "../http";

export type FirestoreTimestamp = {
  _seconds: number;
  _nanoseconds: number;
};

export type GetProductStatusDataResponse = {
  id: string;
  userId: string;
  status: ProductStatusType;
  preferredLanguage: string;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
};

export type GetProductStatusResponse =
  THTTPResponse<GetProductStatusDataResponse>;
