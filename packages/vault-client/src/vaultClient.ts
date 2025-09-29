import { VAULT_ENDPOINTS } from "@workspace/constants";
import {
  TUserRegistrationInput,
  VaultRegisterDataResponse,
  VaultRegisterResponse,
} from "@workspace/types";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class VaultClient {
  private client: AxiosInstance;

  constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
      ...config,
    });
  }

  async createUser(
    userData: TUserRegistrationInput
  ): Promise<VaultRegisterDataResponse> {
    const response = await this.client.post<VaultRegisterResponse>(
      VAULT_ENDPOINTS.AUTH.CREATE_USER,
      userData
    );
    return response.data.data!;
  }
}
