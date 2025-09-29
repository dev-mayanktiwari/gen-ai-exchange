import { logger } from "@workspace/utils";
import dotenv from "dotenv";
dotenv.config();

type ConfigKeys =
  | "PORT"
  | "NODE_ENV"
  | "RAW_UPLOAD_BUCKET"
  | "PROCESSED_UPLOAD_BUCKET"
  | "GOOGLE_APPLICATION_CREDENTIALS"
  | "VAULT_URL"
  | "VAULT_API_KEY"
  | "USE_VAULT_FOR_STORAGE";

const _config: Record<ConfigKeys, string | undefined> = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  RAW_UPLOAD_BUCKET: process.env.RAW_UPLOAD_BUCKET,
  PROCESSED_UPLOAD_BUCKET: process.env.PROCESSED_UPLOAD_BUCKET,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  VAULT_URL: process.env.VAULT_URL,
  VAULT_API_KEY: process.env.VAULT_API_KEY,
  USE_VAULT_FOR_STORAGE: process.env.USE_VAULT_FOR_STORAGE,
};

export const AppConfig = {
  get(key: ConfigKeys): string | number {
    const value = _config[key];
    if (value === undefined) {
      logger.error(`Config key ${key} is not defined`);
      process.exit(1);
    }
    if (key === "PORT") {
      return Number(value);
    }
    return value;
  },
};
