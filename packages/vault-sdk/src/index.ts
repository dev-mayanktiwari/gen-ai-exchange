import { VaultClient } from "@workspace/vault-client";
import { VAULT_ENDPOINTS } from "@workspace/constants";

export class VaultSDK extends VaultClient {
  constructor(baseURL: string) {
    super(baseURL);
  }

  auth = {
    register: this.createUser.bind(this),
  };
}

export function createVaultSDK(baseURL: string): VaultSDK {
  return new VaultSDK(baseURL);
}
