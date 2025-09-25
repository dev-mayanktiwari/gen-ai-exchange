import { Request, Response, NextFunction } from "express";
import { httpError } from "@workspace/utils";
import { ErrorStatusCodes } from "@workspace/constants";

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"] as string;
  const expectedApiKey = process.env.VAULT_API_KEY;

  // Skip auth for health check
  if (req.path === "/health") {
    return next();
  }

  if (!expectedApiKey) {
    return httpError(
      next,
      new Error("Server configuration error: VAULT_API_KEY not set"),
      req,
      ErrorStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR
    );
  }

  if (!apiKey) {
    return httpError(
      next,
      new Error("API key is required"),
      req,
      ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED
    );
  }

  if (apiKey !== expectedApiKey) {
    return httpError(
      next,
      new Error("Invalid API key"),
      req,
      ErrorStatusCodes.CLIENT_ERROR.FORBIDDEN
    );
  }

  next();
};