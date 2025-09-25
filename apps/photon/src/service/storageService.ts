import { logger } from "@workspace/utils";
import { getStorageClient } from "../lib/storage";
import { GetSignedUploadUrlRequest, SignedUrlResponse } from "@workspace/types";
import { vaultClient } from "../lib/vaultClient";

const USE_VAULT_FOR_STORAGE = process.env.USE_VAULT_FOR_STORAGE === "true";

export const StorageService = {
  async getSignedUploadUrl(
    bucketName: string,
    filePath: string,
    contentType: string,
    expiresInSeconds: number = 900
  ) {
    // Option to use vault service for storage operations
    if (USE_VAULT_FOR_STORAGE) {
      try {
        const requestData: GetSignedUploadUrlRequest = {
          bucketName,
          filePath,
          contentType,
          expiresInSeconds,
        };
        const response = await vaultClient.post<SignedUrlResponse>(
          `/storage/signed-upload-url`,
          requestData
        );
        return response.data.data?.url;
      } catch (error) {
        logger.error("Error generating signed URL via vault", error);
        throw new Error("Could not generate signed URL via vault");
      }
    }

    // Direct GCS integration (default behavior)
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
