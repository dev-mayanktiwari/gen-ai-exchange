export interface Product {
  id: string;
  userId: string;
  status: "DRAFT" | "PROCESSING" | "READY" | "PUBLISHED" | "ERROR";
  title?: string;
  description?: string;
  photos?: {
    gcsPath: string;
    width?: number;
    height?: number;
  }[];
  raw?: {
    voicePath?: string;
  };
  preferredLanguage?: string;
  createdAt: Date;
  updatedAt: Date;
}
