import { ErrorStatusCodes, SuccessStatusCodes } from "@workspace/constants";
import {
  FirebaseAuthResponseSchema,
  FirebaseErrorResponseSchema,
  UserLoginInput,
  UserRegistrationInput,
} from "@workspace/types";
import { asyncErrorHandler, httpError, httpResponse } from "@workspace/utils";
import { Request, Response, NextFunction } from "express";
import { getAuthInstance } from "../lib/firebase";
import { createVaultSDK } from "@workspace/vault-sdk";

const vaultSDK = createVaultSDK(process.env.VAULT_BASE_URL || "");

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

      const { email, password, name, role } = safeParse.data;

      const auth = getAuthInstance();

      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      });

      // Set custom claims for role-based access
      await auth.setCustomUserClaims(userRecord.uid, { role });

      // TODO: Implement the vault logic to add the details to firestore
      const response = await vaultSDK.auth.register(safeParse.data);

      return httpResponse(
        req,
        res,
        SuccessStatusCodes.CREATED,
        "User registered successfully",
        {
          uid: response.uid,
          email: response.email,
          role: response.role,
        }
      );
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

      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, returnSecureToken: true }),
        }
      );

      const data = await response.json();

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

      httpResponse(req, res, SuccessStatusCodes.OK, "Login successful", {
        uid: firebaseData.localId,
        email: firebaseData.email,
        displayName: firebaseData.displayName,
        idToken: firebaseData.idToken,
        refreshToken: firebaseData.refreshToken,
        expiresIn: firebaseData.expiresIn,
      });
    }
  ),
};
