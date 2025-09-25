import { z } from "zod";

// Auth Request Types
export const AuthRegisterRequestSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(["artisan", "buyer"]),
  password: z.string().min(6),
  preferredLanguage: z.string().optional(),
});

export const AuthLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const AuthVerifyTokenRequestSchema = z.object({
  token: z.string().min(1),
});

// Firebase Auth Response Types (from Identity Toolkit API)
export const FirebaseAuthResponseSchema = z.object({
  kind: z.string(),
  localId: z.string(),
  email: z.string(),
  displayName: z.string().optional(),
  idToken: z.string(),
  registered: z.boolean(),
  refreshToken: z.string(),
  expiresIn: z.string(),
});

export const FirebaseErrorResponseSchema = z.object({
  error: z.object({
    code: z.number(),
    message: z.string(),
    errors: z.array(z.object({
      message: z.string(),
      domain: z.string(),
      reason: z.string(),
    })).optional(),
  }),
});

// Auth Response Types (Vault API)
export const AuthRegisterResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  request: z.object({
    ip: z.string().optional(),
    method: z.string(),
    url: z.string(),
  }),
  message: z.string(),
  data: z.object({
    uid: z.string(),
    email: z.string(),
    role: z.string(),
  }).optional(),
});

export const AuthLoginResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  request: z.object({
    ip: z.string().optional(),
    method: z.string(),
    url: z.string(),
  }),
  message: z.string(),
  data: z.object({
    uid: z.string(),
    email: z.string(),
    displayName: z.string().optional(),
    idToken: z.string(),
    refreshToken: z.string(),
    expiresIn: z.string(),
  }).optional(),
});

export const AuthVerifyTokenResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  request: z.object({
    ip: z.string().optional(),
    method: z.string(),
    url: z.string(),
  }),
  message: z.string(),
  data: z.object({
    uid: z.string(),
    email: z.string().optional(),
    role: z.string().optional(),
    verified: z.boolean(),
  }).optional(),
});

export const AuthCurrentUserResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  request: z.object({
    ip: z.string().optional(),
    method: z.string(),
    url: z.string(),
  }),
  message: z.string(),
  data: z.object({
    user: z.any(), // Will be User type from entities
  }).optional(),
});

// Type Exports
export type AuthRegisterRequest = z.infer<typeof AuthRegisterRequestSchema>;
export type AuthLoginRequest = z.infer<typeof AuthLoginRequestSchema>;
export type AuthVerifyTokenRequest = z.infer<typeof AuthVerifyTokenRequestSchema>;
export type FirebaseAuthResponse = z.infer<typeof FirebaseAuthResponseSchema>;
export type FirebaseErrorResponse = z.infer<typeof FirebaseErrorResponseSchema>;
export type AuthRegisterResponse = z.infer<typeof AuthRegisterResponseSchema>;
export type AuthLoginResponse = z.infer<typeof AuthLoginResponseSchema>;
export type AuthVerifyTokenResponse = z.infer<typeof AuthVerifyTokenResponseSchema>;
export type AuthCurrentUserResponse = z.infer<typeof AuthCurrentUserResponseSchema>;