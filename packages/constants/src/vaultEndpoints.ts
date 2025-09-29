export const VAULT_ENDPOINTS = {
  AUTH: {
    CREATE_USER: "/auth/register",
    LOGIN: "/auth/login",
  },
  PRODUCTS: {
    CREATE_PRODUCT: "/products",
    GET_PRODUCT: "/products/:productId",
    LIST_PRODUCTS: "/products",
    UPDATE_PRODUCT: (productId: string) => `/products/${productId}`,
    DELETE_PRODUCT: (productId: string) => `/products/${productId}`,
  },
} as const;
