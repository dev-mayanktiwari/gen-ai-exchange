import { Storage } from "@google-cloud/storage";

let storageInstance: Storage | null = null;

export function getStorageInstance(): Storage {
  if (!storageInstance) {
    storageInstance = new Storage();
  }
  return storageInstance;
}

export async function generateSignedUrl(
  bucketName: string,
  objectName: string,
  contentType: string,
  expiresInSeconds: number = 900
): Promise<{
  signedUrl: string;
  gcsUri: string;
}> {
  const storage = getStorageInstance();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(objectName);

  const options = {
    version: "v4" as const,
    action: "write" as const,
    expires: Date.now() + expiresInSeconds * 1000, // 15 minutes
    contentType: contentType,
  };

  const [signedUrl] = await file.getSignedUrl(options);

  return {
    signedUrl,
    gcsUri: `gs://${bucketName}/${objectName}`,
  };
}
