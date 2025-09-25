import { Router } from "express";
import authController from "../controllers/authController";
import { verifyToken } from "../middlewares/auth";

const authRouter: Router = Router();

authRouter.post("/register", authController.register);
authRouter.get("/me", verifyToken, authController.currentUser);
authRouter.post("/login", authController.login);

export default authRouter;
