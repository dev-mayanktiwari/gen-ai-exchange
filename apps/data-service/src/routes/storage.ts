import { Router } from "express";
import { StorageController } from "../controllers/storageController";

export const storageRouter = Router();

storageRouter.post("/signed-upload-url", StorageController.getSignedUploadUrl);
