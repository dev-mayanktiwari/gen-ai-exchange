export type THTTPResponse<T> = {
  success: boolean;
  statusCode: number;
  request: {
    ip?: string | null;
    method: string;
    url: string;
  };
  message: string;
  data: T | null;
  trace?: {
    error: string | undefined;
  };
};
