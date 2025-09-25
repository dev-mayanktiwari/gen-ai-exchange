import { Request, Response, NextFunction } from "express";
import { THTTPError } from "@workspace/types";
import { ApplicationEnvironment } from "@workspace/constants";
import { logger } from "@workspace/utils";

export const globalErrorHandler = (
  err: THTTPError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const env = process.env.NODE_ENV || "development";

  logger.error(`Global Error Handler`, {
    meta: err,
  });

  if (env === ApplicationEnvironment.PRODUCTION) {
    delete err.request.ip;
    delete err.trace;
  }

  res.status(err.statusCode).json(err);
};