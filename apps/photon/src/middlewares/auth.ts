import { ErrorStatusCodes } from "@workspace/constants";
import { AuthenticatedRequest } from "@workspace/types";
import { httpError, logger } from "@workspace/utils";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "../service/authService";

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return httpError(
      next,
      new Error("Unauthorized"),
      req,
      ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!token) {
      return httpError(
        next,
        new Error("Token is required"),
        req,
        ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED
      );
    }

    const vaultResponse = await AuthService.verifyToken({ token });

    if (!vaultResponse.success || !vaultResponse.data) {
      return httpError(
        next,
        new Error("Invalid token"),
        req,
        ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED
      );
    }

    // Set user data from vault response
    (req as AuthenticatedRequest).user = {
      uid: vaultResponse.data.uid,
      email: vaultResponse.data.email,
      role: vaultResponse.data.role,
    };

    next();
  } catch (error: any) {
    logger.error("Error verifying token via vault", {
      meta: error.message,
    });
    return httpError(
      next,
      new Error("Invalid token"),
      req,
      ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED
    );
  }
}
