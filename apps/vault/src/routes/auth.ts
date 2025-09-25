import { Router } from "express";
import { AuthController } from "../controllers/authController";

export const authRouter: Router = Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.post("/verify-token", AuthController.verifyToken);
authRouter.get("/me", AuthController.getCurrentUser);