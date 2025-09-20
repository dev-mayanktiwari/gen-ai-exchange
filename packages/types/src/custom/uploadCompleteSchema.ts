import { z } from "zod";

export const uploadCompleteSchema = z.object({
  images: z
    .array(
      z.object({
        gcsPath: z.string().startsWith("gs://"),
        width: z.number().int().optional(),
        height: z.number().int().optional(),
      })
    )
    .min(1),
  voice: z
    .object({
      gcsPath: z.string().startsWith("gs://"),
      durationMs: z.number().optional(),
    })
    .optional(),
});

export type TUploadCompleteSchema = z.infer<typeof uploadCompleteSchema>;
