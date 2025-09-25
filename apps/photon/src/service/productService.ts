import { Product } from "@workspace/types";
import {
  CreateProductDraftRequest,
  UpdateProductRequest,
  MarkUploadsCompleteRequest,
  ProductResponse
} from "@workspace/types";
import { vaultClient } from "../lib/vaultClient";

export const ProductService = {
  async createDraft(userId: string, preferredLanguage?: string) {
    const requestData: CreateProductDraftRequest = {
      userId,
      preferredLanguage,
    };
    const response = await vaultClient.post<ProductResponse>(
      `/products/drafts`,
      requestData
    );
    return response.data.data?.product as Product;
  },

  async getProductById(productId: string) {
    const response = await vaultClient.get<ProductResponse>(
      `/products/${productId}`
    );
    return (response.data.data?.product as Product) ?? null;
  },

  async updateProduct(productId: string, updateData: UpdateProductRequest) {
    const response = await vaultClient.patch(
      `/products/${productId}`,
      updateData
    );
    return response.data;
  },

  async userOwnsProduct(userId: string, productId: string) {
    const product = await this.getProductById(productId);
    return !!product && product.userId === userId;
  },

  async markUploadsComplete(
    productId: string,
    files: MarkUploadsCompleteRequest
  ) {
    const response = await vaultClient.post(
      `/products/${productId}/uploads/complete`,
      files
    );
    return response.data;
  },
};
