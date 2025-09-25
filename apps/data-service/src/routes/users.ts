import { Router } from "express";
import { UsersController } from "../controllers/usersController";

export const usersRouter = Router();

usersRouter.get("/:id", UsersController.getById);
usersRouter.put("/:id", UsersController.upsert);
