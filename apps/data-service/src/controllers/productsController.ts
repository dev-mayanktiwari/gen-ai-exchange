import { Request, Response } from "express";
import { ProductService } from "../service/productService";

export const ProductsController = {
  async createDraft(req: Request, res: Response) {
    const { userId, preferredLanguage } = (req.body || {}) as {
      userId: string;
      preferredLanguage?: string;
    };
    const product = await ProductService.createDraft(userId, preferredLanguage);
    res.json({ product });
  },

  async getById(req: Request, res: Response) {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json({ product });
  },

  async update(req: Request, res: Response) {
    await ProductService.updateProduct(req.params.id, req.body || {});
    res.json({ success: true });
  },

  async markUploadsComplete(req: Request, res: Response) {
    await ProductService.markUploadsComplete(req.params.id, req.body);
    res.json({ success: true });
  },
};
