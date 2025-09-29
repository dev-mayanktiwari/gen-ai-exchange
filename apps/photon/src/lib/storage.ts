import { Storage } from "@google-cloud/storage";

let storageClient: Storage;

// Currently not in use - to be used for generating signed URLs for uploads
// when we move to GCS for storage in photon
export const getStorageClient = () => {
  if (!storageClient) {
    storageClient = new Storage();
  }
  return storageClient;
};
