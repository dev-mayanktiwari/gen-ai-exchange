import { Router } from "express";
import { ProductsController } from "../controllers/productsController";

export const productsRouter: Router = Router();

productsRouter.post("/drafts", ProductsController.createDraft);
productsRouter.get("/:id", ProductsController.getById);
productsRouter.patch("/:id", ProductsController.update);
productsRouter.post(
  "/:id/uploads/complete",
  ProductsController.markUploadsComplete
);
