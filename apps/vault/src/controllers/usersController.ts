import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler, httpError, httpResponse } from "@workspace/utils";
import { ErrorStatusCodes, SuccessStatusCodes } from "@workspace/constants";
import { CreateOrUpdateUserRequestSchema } from "@workspace/types";
import { userService } from "../service/userService";

export const UsersController = {
  getById: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;

      if (!userId) {
        return httpError(
          next,
          new Error("User ID is required"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST
        );
      }

      const user = await userService.getUserById(userId);

      if (!user) {
        return httpError(
          next,
          new Error("User not found"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.NOT_FOUND
        );
      }

      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "User retrieved successfully",
        { user }
      );
    }
  ),
  upsert: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      const body = req.body;

      if (!userId) {
        return httpError(
          next,
          new Error("User ID is required"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST
        );
      }

      const safeParse = CreateOrUpdateUserRequestSchema.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid input"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }

      await userService.createOrUpdateUser(userId, safeParse.data);

      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "User created/updated successfully"
      );
    }
  ),
};
