import { z } from "zod";

export const ProductDraftSchema = z.object({
  photosCount: z.number().int().min(1).max(3),
  includeVoice: z.boolean(),
  preferredLanguage: z
    .enum([
      "hi",
      "en",
      "bn",
      "te",
      "mr",
      "ta",
      "ur",
      "gu",
      "kn",
      "ml",
      "or",
      "pa",
      "as",
      "ks",
      "kok",
      "mai",
      "ne",
      "sd",
      "si",
      "sa",
      "bo",
      "doi",
      "mni",
    ])
    .optional(),
});

export type TProductDraftSchema = z.infer<typeof ProductDraftSchema>;
