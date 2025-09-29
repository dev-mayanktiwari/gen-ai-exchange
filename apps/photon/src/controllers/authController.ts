import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler, httpError } from "@workspace/utils";
import { ErrorStatusCodes } from "@workspace/constants";
import {
  UserLoginInput,
  UserRegistrationInput,
  AuthenticatedRequest,
} from "@workspace/types";
import { AuthService } from "../service/authService";

export default {
  register: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      const safeParse = UserRegistrationInput.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid input"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }

      try {
        const vaultResponse = await AuthService.register(safeParse.data);

        // Return the vault response directly
        res.status(vaultResponse.statusCode).json(vaultResponse);
      } catch (error: any) {
        return httpError(
          next,
          new Error(`Registration failed: ${error.message}`),
          req,
          ErrorStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR
        );
      }
    }
  ),

  login: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      const safeParse = UserLoginInput.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid input"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }

      try {
        const vaultResponse = await AuthService.login(safeParse.data);

        // Return the vault response directly
        res.status(vaultResponse.statusCode).json(vaultResponse);
      } catch (error: any) {
        return httpError(
          next,
          new Error(`Login failed: ${error.message}`),
          req,
          ErrorStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR
        );
      }
    }
  ),

  currentUser: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = (req as AuthenticatedRequest).user;

      if (!user?.uid) {
        return httpError(
          next,
          new Error("User not authenticated"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED
        );
      }

      try {
        // Get the token from the request header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return httpError(
            next,
            new Error("Authorization header required"),
            req,
            ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED
          );
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
          return httpError(
            next,
            new Error("Token is required"),
            req,
            ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED
          );
        }

        const vaultResponse = await AuthService.getCurrentUser(token);

        // Return the vault response directly
        res.status(vaultResponse.statusCode).json(vaultResponse);
      } catch (error: any) {
        return httpError(
          next,
          new Error(`Failed to get current user: ${error.message}`),
          req,
          ErrorStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR
        );
      }
    }
  ),
};
