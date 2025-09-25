import { z } from "zod";

// User Role Enum
export const UserRole = {
  ARTISAN: "artisan",
  BUYER: "buyer",
} as const;

export type UserRoleType = keyof typeof UserRole;

// User Schema
export const UserSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(["user", "admin", "artisan", "buyer"]),
  preferredLanguage: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Type Exports
export type User = z.infer<typeof UserSchema>;