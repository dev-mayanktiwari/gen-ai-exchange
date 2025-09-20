import { Router } from "express";
import { verifyToken } from "../middlewares/auth";
import productController from "../controllers/productController";

const productRouter: Router = Router();

productRouter.post(
  "/:productId/upload-complete",
  verifyToken,
  productController.markUploadsComplete
);
productRouter.post("/draft", verifyToken, productController.create);
productRouter.get("/:productId", verifyToken, productController.getProductById);

export default productRouter;
