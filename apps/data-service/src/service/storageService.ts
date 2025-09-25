import { logger } from "@workspace/utils";
import { getStorageClient } from "../lib/storage";

export const StorageService = {
  async getSignedUploadUrl(
    bucketName: string,
    filePath: string,
    contentType: string,
    expiresInSeconds: number = 900
  ) {
    const options = {
      version: "v4" as const,
      action: "write" as const,
      expires: Date.now() + expiresInSeconds * 1000,
      contentType,
    };
    try {
      const [url] = await getStorageClient()
        .bucket(bucketName)
        .file(filePath)
        .getSignedUrl(options);
      return url;
    } catch (error) {
      logger.error("Error generating signed URL", error);
      throw new Error("Could not generate signed URL");
    }
  },
};
