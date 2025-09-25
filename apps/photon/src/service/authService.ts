import {
  AuthRegisterRequest,
  AuthLoginRequest,
  AuthVerifyTokenRequest,
  AuthRegisterResponse,
  AuthLoginResponse,
  AuthVerifyTokenResponse,
  AuthCurrentUserResponse,
} from "@workspace/types";
import { vaultClient } from "../lib/vaultClient";

export const AuthService = {
  async register(userData: AuthRegisterRequest) {
    const response = await vaultClient.post<AuthRegisterResponse>(
      "/auth/register",
      userData
    );
    return response.data;
  },

  async login(credentials: AuthLoginRequest) {
    const response = await vaultClient.post<AuthLoginResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  async verifyToken(tokenData: AuthVerifyTokenRequest) {
    const response = await vaultClient.post<AuthVerifyTokenResponse>(
      "/auth/verify-token",
      tokenData
    );
    return response.data;
  },

  async getCurrentUser(token: string) {
    const response = await vaultClient.get<AuthCurrentUserResponse>("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};