import axios from "axios";
import { Product } from "../lib/product";

const DATA_SERVICE_URL =
  process.env.DATA_SERVICE_URL || "http://localhost:4001";

export const ProductService = {
  async createDraft(userId: string, preferredLanguage?: string) {
    const { data } = await axios.post(`${DATA_SERVICE_URL}/products/drafts`, {
      userId,
      preferredLanguage,
    });
    return data.product as Product;
  },

  async getProductById(productId: string) {
    const { data } = await axios.get(
      `${DATA_SERVICE_URL}/products/${productId}`
    );
    return (data.product as Product) ?? null;
  },

  async updateProduct(productId: string, data: Partial<Product>) {
    await axios.patch(`${DATA_SERVICE_URL}/products/${productId}`, data);
  },

  async userOwnsProduct(userId: string, productId: string) {
    const product = await this.getProductById(productId);
    return !!product && product.userId === userId;
  },

  async markUploadsComplete(
    productId: string,
    files: {
      images: Array<{
        gcsPath: string;
        width?: number;
        height?: number;
      }>;
      voice?: {
        gcsPath: string;
        durationMs?: number;
      };
    }
  ) {
    await axios.post(
      `${DATA_SERVICE_URL}/products/${productId}/uploads/complete`,
      files
    );
  },
};
