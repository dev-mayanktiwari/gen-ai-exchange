import { z } from "zod";

// Product Status Enum
export const ProductStatus = {
  DRAFT: "DRAFT",
  PROCESSING: "PROCESSING",
  READY: "READY",
  PUBLISHED: "PUBLISHED",
  ERROR: "ERROR",
} as const;

export type ProductStatusType = keyof typeof ProductStatus;

// Photo Schema
export const PhotoSchema = z.object({
  gcsPath: z.string().startsWith("gs://"),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

// Raw Data Schema
export const ProductRawDataSchema = z.object({
  voicePath: z.string().optional(),
});

// Product Schema
export const ProductSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.enum(["DRAFT", "PROCESSING", "READY", "PUBLISHED", "ERROR"]),
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  price: z.number().positive().optional(),
  isPublic: z.boolean().optional(),
  photos: z.array(PhotoSchema).optional(),
  raw: ProductRawDataSchema.optional(),
  preferredLanguage: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Type Exports
export type Photo = z.infer<typeof PhotoSchema>;
export type ProductRawData = z.infer<typeof ProductRawDataSchema>;
export type Product = z.infer<typeof ProductSchema>;