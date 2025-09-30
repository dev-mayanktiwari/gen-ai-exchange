export const VAULT_ENDPOINTS = {
  AUTH: {
    CREATE_USER: "/auth/register",
    LOGIN: "/auth/login",
  },
  PRODUCTS: {
    CREATE_PRODUCT: "/products/draft",
    GET_PRODUCT: (productId: string) => `/products/${productId}`,
    UPLOAD_COMPLETE: (productId: string) =>
      `/products/${productId}/upload-complete`,
  },
} as const;
