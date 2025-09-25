import { z } from "zod";

// Product API Types
export const CreateProductDraftRequestSchema = z.object({
  userId: z.string().min(1),
  preferredLanguage: z.string().optional(),
});

export const UpdateProductRequestSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  price: z.number().optional(),
  isPublic: z.boolean().optional(),
});

export const MarkUploadsCompleteRequestSchema = z.object({
  images: z.array(z.object({
    gcsPath: z.string().startsWith("gs://"),
    width: z.number().int().optional(),
    height: z.number().int().optional(),
  })).min(1),
  voice: z.object({
    gcsPath: z.string().startsWith("gs://"),
    durationMs: z.number().optional(),
  }).optional(),
});

// User API Types
export const CreateOrUpdateUserRequestSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(["user", "admin", "artisan", "buyer"]),
  preferredLanguage: z.string().optional(),
});

// Storage API Types
export const GetSignedUploadUrlRequestSchema = z.object({
  bucketName: z.string().min(1),
  filePath: z.string().min(1),
  contentType: z.string().min(1),
  expiresInSeconds: z.number().int().positive().optional(),
});

// Response Types - matching THTTPResponse structure
export const ProductResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  request: z.object({
    ip: z.string().optional(),
    method: z.string(),
    url: z.string(),
  }),
  message: z.string(),
  data: z.object({
    product: z.any(), // Will be the Product type from lib
  }).optional(),
});

export const UserResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  request: z.object({
    ip: z.string().optional(),
    method: z.string(),
    url: z.string(),
  }),
  message: z.string(),
  data: z.object({
    user: z.any(), // Will be the User type from lib
  }).optional(),
});

export const SignedUrlResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  request: z.object({
    ip: z.string().optional(),
    method: z.string(),
    url: z.string(),
  }),
  message: z.string(),
  data: z.object({
    url: z.string().url(),
  }).optional(),
});

export const SuccessResponseSchema = z.object({
  success: z.literal(true),
  statusCode: z.number(),
  request: z.object({
    ip: z.string().optional(),
    method: z.string(),
    url: z.string(),
  }),
  message: z.string(),
});

// Type exports
export type CreateProductDraftRequest = z.infer<typeof CreateProductDraftRequestSchema>;
export type UpdateProductRequest = z.infer<typeof UpdateProductRequestSchema>;
export type MarkUploadsCompleteRequest = z.infer<typeof MarkUploadsCompleteRequestSchema>;
export type CreateOrUpdateUserRequest = z.infer<typeof CreateOrUpdateUserRequestSchema>;
export type GetSignedUploadUrlRequest = z.infer<typeof GetSignedUploadUrlRequestSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type SignedUrlResponse = z.infer<typeof SignedUrlResponseSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;