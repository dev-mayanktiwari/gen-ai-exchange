import {
  initializeApp,
  getApps,
  cert,
  ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export const initFirebase = () => {
  const apps = getApps();

  if (apps.length > 0) {
    return { auth: getAuth() };
  }

  let credential;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // Use environment variable for service account
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) as ServiceAccount;
    credential = cert(serviceAccount);
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    // Use path to service account file
    credential = cert(require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH) as ServiceAccount);
  } else {
    // Default to application default credentials (for local development)
    credential = undefined;
  }

  const app = initializeApp({
    credential,
    projectId: process.env.FIREBASE_PROJECT_ID,
  });

  return { auth: getAuth(app) };
};

// Export a singleton auth instance
let authInstance: ReturnType<typeof getAuth> | null = null;

export const getAuthInstance = () => {
  if (!authInstance) {
    const { auth } = initFirebase();
    authInstance = auth;
  }
  return authInstance;
};
