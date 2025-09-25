import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler, httpError, httpResponse } from "@workspace/utils";
import { ErrorStatusCodes, SuccessStatusCodes } from "@workspace/constants";
import {
  AuthRegisterRequestSchema,
  AuthLoginRequestSchema,
  AuthVerifyTokenRequestSchema,
  FirebaseAuthResponseSchema,
  FirebaseErrorResponseSchema,
} from "@workspace/types";
import { getAuthInstance } from "../lib/firebase";
import { userService } from "../service/userService";

export const AuthController = {
  register: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      const safeParse = AuthRegisterRequestSchema.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid registration input"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }

      const { email, name, role, password, preferredLanguage } = safeParse.data;

      try {
        const auth = getAuthInstance();

        // Create user in Firebase Auth
        const userRecord = await auth.createUser({
          email,
          password,
          displayName: name,
        });

        // Set custom claims for role-based access
        await auth.setCustomUserClaims(userRecord.uid, { role });

        // Create user in Firestore via userService
        await userService.createOrUpdateUser(userRecord.uid, {
          uid: userRecord.uid,
          email,
          name,
          role,
          preferredLanguage,
        });

        httpResponse(
          req,
          res,
          SuccessStatusCodes.CREATED,
          "User registered successfully",
          {
            uid: userRecord.uid,
            email: userRecord.email,
            role,
          }
        );
      } catch (error: any) {
        return httpError(
          next,
          new Error(`Registration failed: ${error.message}`),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST
        );
      }
    }
  ),

  login: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      const safeParse = AuthLoginRequestSchema.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid login input"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }

      const { email, password } = safeParse.data;
      const firebaseApiKey = process.env.FIREBASE_API_KEY;

      if (!firebaseApiKey) {
        return httpError(
          next,
          new Error("Firebase API key not configured"),
          req,
          ErrorStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR
        );
      }

      try {
        // Use Firebase Identity Toolkit REST API for login
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, returnSecureToken: true }),
          }
        );

        const data = await response.json();

        // Check for Firebase error response
        const errorParse = FirebaseErrorResponseSchema.safeParse(data);
        if (errorParse.success) {
          return httpError(
            next,
            new Error(errorParse.data.error.message),
            req,
            ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED
          );
        }

        // Validate successful Firebase response
        const successParse = FirebaseAuthResponseSchema.safeParse(data);
        if (!successParse.success) {
          return httpError(
            next,
            new Error("Invalid Firebase response format"),
            req,
            ErrorStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR
          );
        }

        const firebaseData = successParse.data;

        httpResponse(
          req,
          res,
          SuccessStatusCodes.OK,
          "Login successful",
          {
            uid: firebaseData.localId,
            email: firebaseData.email,
            displayName: firebaseData.displayName,
            idToken: firebaseData.idToken,
            refreshToken: firebaseData.refreshToken,
            expiresIn: firebaseData.expiresIn,
          }
        );
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

  verifyToken: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      const safeParse = AuthVerifyTokenRequestSchema.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid token verification input"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }

      const { token } = safeParse.data;

      try {
        const auth = getAuthInstance();
        const decodedToken = await auth.verifyIdToken(token);

        httpResponse(
          req,
          res,
          SuccessStatusCodes.OK,
          "Token verified successfully",
          {
            uid: decodedToken.uid,
            email: decodedToken.email,
            role: decodedToken.role,
            verified: true,
          }
        );
      } catch (error: any) {
        return httpError(
          next,
          new Error("Invalid or expired token"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED
        );
      }
    }
  ),

  getCurrentUser: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
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

      try {
        if (!token) {
          return httpError(
            next,
            new Error("Token is required"),
            req,
            ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED
          );
        }

        const auth = getAuthInstance();
        const decodedToken = await auth.verifyIdToken(token);

        // Get user data from Firestore
        const userData = await userService.getUserById(decodedToken.uid);

        if (!userData) {
          return httpError(
            next,
            new Error("User not found in database"),
            req,
            ErrorStatusCodes.CLIENT_ERROR.NOT_FOUND
          );
        }

        httpResponse(
          req,
          res,
          SuccessStatusCodes.OK,
          "Current user retrieved successfully",
          {
            user: userData,
          }
        );
      } catch (error: any) {
        return httpError(
          next,
          new Error("Failed to get current user"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED
        );
      }
    }
  ),
};