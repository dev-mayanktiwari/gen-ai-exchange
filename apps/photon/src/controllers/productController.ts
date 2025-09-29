import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler, httpError, httpResponse } from "@workspace/utils";
import { ErrorStatusCodes, SuccessStatusCodes } from "@workspace/constants";
import {
  AuthenticatedRequest,
  ProductDraftSchema,
  uploadCompleteSchema,
} from "@workspace/types";
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
      const imageUploads: { signedUrl: string; gcsPath: string }[] = [];

      for (let i = 0; i < photosCount; i++) {
        const imagePath = `users/${
          (req as AuthenticatedRequest).user?.uid
        }/products/${productId.id}/raw/img-${i + 1}.jpg`;

        const signedUrl = await StorageService.getSignedUploadUrl(
          uploadBucket,
          imagePath,
          "image/jpeg"
        );

        if (!signedUrl) {
          return httpError(
            next,
            new Error("Failed to generate signed URL for image upload"),
            req,
            ErrorStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR
          );
        }

        imageUploads.push({
          signedUrl,
          gcsPath: `gs://${uploadBucket}/${imagePath}`,
        });
      }

      let voiceUpload: { signedUrl: string; gcsPath: string } | undefined =
        undefined;

      if (includeVoice) {
        const voicePath = `users/${
          (req as AuthenticatedRequest).user?.uid
        }/products/${productId.id}/raw/voice.wav`;

        const signedUrl = await StorageService.getSignedUploadUrl(
          uploadBucket,
          voicePath,
          "audio/wav"
        );

        if (!signedUrl) {
          return httpError(
            next,
            new Error("Failed to generate signed URL for voice upload"),
            req,
            ErrorStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR
          );
        }

        voiceUpload = {
          signedUrl,
          gcsPath: `gs://${uploadBucket}/${voicePath}`,
        };
      }

      httpResponse(req, res, SuccessStatusCodes.OK, "Draft Created", {
        productId,
        uploadUrls: {
          images: imageUploads,
          voice: voiceUpload,
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

  markUploadsComplete: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const productId = req.params.productId;

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

      const body = req.body;
      const safeParse = uploadCompleteSchema.safeParse(body);
      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid input"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }
      const { images, voice } = safeParse.data;

      const userPrefix = `gs://${AppConfig.get("RAW_UPLOAD_BUCKET")}/users/${
        (req as AuthenticatedRequest).user?.uid
      }/products/${productId}/raw/`;
      const allPaths = [...images.map((img) => img.gcsPath)];
      if (voice) allPaths.push(voice.gcsPath);

      const invalidPath = allPaths.find((path) => !path.startsWith(userPrefix));
      if (invalidPath) {
        return httpError(
          next,
          new Error("Invalid file paths"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST
        );
      }

      await ProductService.markUploadsComplete(productId, {
        images,
        voice,
      });

      // TODO: Move job creation and pub/sub messaging to vault service
      // These should be handled by vault after upload completion
      // const jobId = await JobService.createJob(String(productId));
      // const messageData = {
      //   jobId,
      //   productId,
      //   userId: (req as AuthenticatedRequest).user?.uid as string,
      //   imagePaths: images.map((img) => img.gcsPath),
      //   voicePath: voice?.gcsPath,
      //   preferredLanguage: product.preferredLanguage,
      // };
      // const messageId = await PubSubService.publishMessage(
      //   "generate-assets",
      //   messageData
      // );

      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "Uploads marked as complete"
      );
    }
  ),
};
