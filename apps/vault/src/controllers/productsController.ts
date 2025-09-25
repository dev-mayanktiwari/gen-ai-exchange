import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler, httpError, httpResponse } from "@workspace/utils";
import { ErrorStatusCodes, SuccessStatusCodes } from "@workspace/constants";
import {
  CreateProductDraftRequestSchema,
  UpdateProductRequestSchema,
  MarkUploadsCompleteRequestSchema,
} from "@workspace/types";
import { ProductService } from "../service/productService";

export const ProductsController = {
  createDraft: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      const safeParse = CreateProductDraftRequestSchema.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid input"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }

      const { userId, preferredLanguage } = safeParse.data;
      const product = await ProductService.createDraft(userId, preferredLanguage);

      httpResponse(
        req,
        res,
        SuccessStatusCodes.CREATED,
        "Product draft created successfully",
        { product }
      );
    }
  ),

  getById: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const productId = req.params.id;

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

      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "Product retrieved successfully",
        { product }
      );
    }
  ),

  update: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const productId = req.params.id;
      const body = req.body;

      if (!productId) {
        return httpError(
          next,
          new Error("Product ID is required"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST
        );
      }

      const safeParse = UpdateProductRequestSchema.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid input"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }

      await ProductService.updateProduct(productId, safeParse.data);

      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "Product updated successfully"
      );
    }
  ),

  markUploadsComplete: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const productId = req.params.id;
      const body = req.body;

      if (!productId) {
        return httpError(
          next,
          new Error("Product ID is required"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST
        );
      }

      const safeParse = MarkUploadsCompleteRequestSchema.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid input"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }

      await ProductService.markUploadsComplete(productId, safeParse.data);

      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "Upload marked as complete successfully"
      );
    }
  ),
};
