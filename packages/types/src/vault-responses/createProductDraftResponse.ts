import { ProductStatusType } from "../entities";
import { THTTPResponse } from "../http";

export type ProductDraftSchemaDataResponse = {
  productId: {
    id: string;
    userId: string;
    status: ProductStatusType;
    preferredLanguage: string;
    createdAt: string;
    updatedAt: string;
  };
  uploadUrls: {
    images: Array<{
      signedUrl: string;
      gcsPath: string;
    }>;
    voice: {
      signedUrl: string;
      gcsPath: string;
    };
  };
};

export type ProductDraftResponse =
  THTTPResponse<ProductDraftSchemaDataResponse>;
