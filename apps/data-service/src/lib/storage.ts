import { Storage } from "@google-cloud/storage";
import path from "path";

let storageClient: Storage | null = null;

export function getStorageClient(): Storage {
  if (!storageClient) {
    storageClient = new Storage({
      keyFilename: path.resolve(
        __dirname,
        "../../gen-ai-hackathon-123-firebase-adminsdk-fbsvc-fd5985da59.json"
      ),
    });
  }
  return storageClient;
}
