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

  const app = initializeApp({
    credential: cert(
      require("../../gen-ai-hackathon-123-firebase-adminsdk-fbsvc-fd5985da59.json") as ServiceAccount
    ),
  });

  return { auth: getAuth(app) };
};
