export type ApiErrorOptions = {
  status: number;
  message: string;
  code?: string;
  isNetwork?: boolean;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly isNetwork: boolean;

  constructor({ status, message, code, isNetwork = false }: ApiErrorOptions) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.isNetwork = isNetwork;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}
