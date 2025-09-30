import { VAULT_ENDPOINTS } from "@workspace/constants";
import {
  GetProductStatusDataResponse,
  GetProductStatusResponse,
  ProductDraftResponse,
  ProductDraftSchemaDataResponse,
  TProductDraftSchema,
  TUploadCompleteSchema,
  TUserRegistrationInput,
  UploadCompleteDataResponse,
  UploadCompleteResponse,
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

  async createDraftProduct(
    productData: TProductDraftSchema
  ): Promise<ProductDraftSchemaDataResponse> {
    const response = await this.client.post<ProductDraftResponse>(
      VAULT_ENDPOINTS.PRODUCTS.CREATE_PRODUCT,
      productData
    );
    return response.data.data!;
  }

  async markUploadComplete(
    productId: string,
    data: TUploadCompleteSchema
  ): Promise<UploadCompleteDataResponse> {
    const response = await this.client.post<UploadCompleteResponse>(
      VAULT_ENDPOINTS.PRODUCTS.UPLOAD_COMPLETE(productId),
      data
    );
    return response.data.data!;
  }

  async getProductStatus(
    productId: string
  ): Promise<GetProductStatusDataResponse> {
    const response = await this.client.get<GetProductStatusResponse>(
      VAULT_ENDPOINTS.PRODUCTS.GET_PRODUCT(productId)
    );
    return response.data.data!;
  }
}
