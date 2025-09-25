import { Storage } from "@google-cloud/storage";

let storageClient: Storage;

export const getStorageClient = () => {
  if (!storageClient) {
    storageClient = new Storage();
  }
  return storageClient;
};
