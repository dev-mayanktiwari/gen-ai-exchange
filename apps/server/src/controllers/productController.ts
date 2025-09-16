import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler, httpError, httpResponse } from "@workspace/utils";
import { ErrorStatusCodes, SuccessStatusCodes } from "@workspace/constants";
import { AuthenticatedRequest, ProductDraftSchema } from "@workspace/types";
import { ProductService } from "../service/productService";
import { AppConfig } from "../config";
import { StorageService } from "../service/storageService";

export default {
  create: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;

      const safeParse = ProductDraftSchema.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid input"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }

      const { photosCount, includeVoice, preferredLanguage } = safeParse.data;

      const productId = await ProductService.createDraft(
        (req as AuthenticatedRequest)?.user?.uid as string,
        preferredLanguage
      );

      console.log("Product ID:", productId);

      const uploadBucket = String(AppConfig.get("RAW_UPLOAD_BUCKET"));
      const imageUrls: string[] = [];

      for (let i = 0; i < photosCount; i++) {
        const imagePath = `users/${(req as AuthenticatedRequest).user?.uid}/products/${productId.id}/raw/img-${i + 1}.jpg`;
        const signedUrl = await StorageService.getSignedUploadUrl(
          uploadBucket,
          imagePath,
          "image/jpeg"
        );
        imageUrls.push(signedUrl);
      }

      let voiceUrl: string | undefined;
      if (includeVoice) {
        const voicePath = `users/${(req as AuthenticatedRequest).user?.uid}/products/${productId}/raw/voice.wav`;
        voiceUrl = await StorageService.getSignedUploadUrl(
          uploadBucket,
          voicePath,
          "audio/wav"
        );
      }

      httpResponse(req, res, SuccessStatusCodes.OK, "Draft Created", {
        productId,
        uploadUrls: {
          images: imageUrls,
          voice: voiceUrl,
        },
      });
    }
  ),

  getProductById: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { productId } = req.params;
      if (!productId) {
        return httpError(
          next,
          new Error("Product ID is required"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST
        );
      }
      const product = await ProductService.getProductById(productId);

      if (!product) {
        return httpError(
          next,
          new Error("Product not found"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.NOT_FOUND
        );
      }

      if (product.userId !== (req as AuthenticatedRequest)?.user?.uid) {
        return httpError(
          next,
          new Error("Forbidden"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.FORBIDDEN
        );
      }

      httpResponse(req, res, SuccessStatusCodes.OK, "Product Details", {
        product,
      });
    }
  ),
};
