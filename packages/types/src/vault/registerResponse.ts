import { THTTPResponse } from "../http";

export type VaultRegisterDataResponse = {
  uid: string;
  email: string;
  role: string;
};

export type VaultRegisterResponse = THTTPResponse<VaultRegisterDataResponse>;
