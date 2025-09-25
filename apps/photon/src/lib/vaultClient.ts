import axios, { AxiosInstance } from "axios";

const VAULT_URL = process.env.VAULT_URL || "http://localhost:4001";
const VAULT_API_KEY = process.env.VAULT_API_KEY;

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
      console.log(`Vault Request: ${config.method?.toUpperCase()} ${config.url}`);
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
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Vault authentication failed - check API key");
    }
    return Promise.reject(error);
  }
);