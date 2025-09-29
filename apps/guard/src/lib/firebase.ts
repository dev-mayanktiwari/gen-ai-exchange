import {
  cert,
  getApps,
  initializeApp,
  ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const initFirebase = () => {
  const apps = getApps();

  if (apps.length > 0) {
    return { auth: getAuth() };
  }
  const app = initializeApp({
    credential: cert(
      require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH!) as ServiceAccount
    ),
  });

  return { auth: getAuth(app) };
};

let authInstance: ReturnType<typeof getAuth> | null = null;

export const getAuthInstance = () => {
  if (!authInstance) {
    const { auth } = initFirebase();
    authInstance = auth;
  }
  return authInstance;
};
