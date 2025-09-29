import axios, { AxiosInstance } from "axios";
import { AppConfig } from "../config";

const VAULT_URL = String(AppConfig.get("VAULT_URL")) || "http://localhost:4001";
const VAULT_API_KEY = String(AppConfig.get("VAULT_API_KEY"));

if (!VAULT_API_KEY) {
  throw new Error("VAULT_API_KEY environment variable is required");
}

// Create axios instance with API key authentication
export const vaultClient: AxiosInstance = axios.create({
  baseURL: VAULT_URL,
  headers: {
    "X-API-Key": VAULT_API_KEY,
    "Content-Type": "application/json",
  },
});

// Add request interceptor for logging
vaultClient.interceptors.request.use(
  (config) => {
    // Don't log the API key in production
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `Vault Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
vaultClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Vault Response Error:", error.response?.data);

    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Vault authentication failed - check API key");
    }

    // Extract error message from vault response
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error?.message ||
      error.message ||
      "Unknown error from vault";

    return Promise.reject(new Error(errorMessage));
  }
);
