import { Request, Response } from "express";
import { StorageService } from "../service/storageService";

export const StorageController = {
  async getSignedUploadUrl(req: Request, res: Response) {
    const { bucketName, filePath, contentType, expiresInSeconds } = (req.body ||
      {}) as {
      bucketName: string;
      filePath: string;
      contentType: string;
      expiresInSeconds?: number;
    };
    const url = await StorageService.getSignedUploadUrl(
      bucketName,
      filePath,
      contentType,
      expiresInSeconds ?? 900
    );
    res.json({ url });
  },
};
