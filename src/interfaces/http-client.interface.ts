export type RequestOptions = {
  params?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
};

export interface HttpClient {
  get(url: string, options?: RequestOptions): Promise<unknown>;
  post(url: string, body?: unknown, options?: RequestOptions): Promise<unknown>;
  patch(url: string, body?: unknown, options?: RequestOptions): Promise<unknown>;
  put(url: string, body?: unknown, options?: RequestOptions): Promise<unknown>;
  delete(url: string, options?: RequestOptions): Promise<unknown>;
}
