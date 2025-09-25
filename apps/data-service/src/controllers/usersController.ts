import { Request, Response } from "express";
import { userService } from "../service/userService";

export const UsersController = {
  async getById(req: Request, res: Response) {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json({ user });
  },
  async upsert(req: Request, res: Response) {
    await userService.createOrUpdateUser(req.params.id, req.body || {});
    res.json({ success: true });
  },
};
