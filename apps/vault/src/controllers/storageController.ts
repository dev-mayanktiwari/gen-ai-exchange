import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler, httpError, httpResponse } from "@workspace/utils";
import { ErrorStatusCodes, SuccessStatusCodes } from "@workspace/constants";
import { GetSignedUploadUrlRequestSchema } from "@workspace/types";
import { StorageService } from "../service/storageService";

export const StorageController = {
  getSignedUploadUrl: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      const safeParse = GetSignedUploadUrlRequestSchema.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid input"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }

      const { bucketName, filePath, contentType, expiresInSeconds } = safeParse.data;
      const url = await StorageService.getSignedUploadUrl(
        bucketName,
        filePath,
        contentType,
        expiresInSeconds ?? 900
      );

      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "Signed URL generated successfully",
        { url }
      );
    }
  ),
};
