import { CreateOrUpdateUserRequest, UserResponse } from "@workspace/types";
import { vaultClient } from "../lib/vaultClient";

export const userService = {
  async createOrUpdateUser(
    userId: string,
    userData: CreateOrUpdateUserRequest
  ) {
    const response = await vaultClient.put(`/users/${userId}`, userData);
    return response.data;
  },

  async getUserById(userId: string) {
    const response = await vaultClient.get<UserResponse>(`/users/${userId}`);
    return response.data.data?.user ?? null;
  },
};
