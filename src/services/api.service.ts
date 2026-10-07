import axios, {
  type AxiosInstance,
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
  isAxiosError,
  isCancel,
} from 'axios';

import { TIME_IN_MS } from '@constants/time.constants';
import { ApiError } from '@interfaces/api-error.interface';
import type { HttpClient, RequestOptions } from '@interfaces/http-client.interface';
import { i18n } from '@lib/i18n';

const REQUEST_TIMEOUT = 10 * TIME_IN_MS.SECOND;
const TIMEOUT_CODES = new Set(['ECONNABORTED', 'ETIMEDOUT']);

type NestErrorBody = {
  statusCode?: number;
  message?: string | string[];
  error?: string;
};

function readMessage(body: NestErrorBody | undefined): string {
  if (Array.isArray(body?.message) && body.message.length > 0) return body.message.join('\n');
  if (typeof body?.message === 'string' && body.message.length > 0) return body.message;
  return i18n.t('errors.unexpected');
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (!isAxiosError(error)) {
    return new ApiError({ status: 0, message: i18n.t('errors.unexpected') });
  }

  if (error.response) {
    const body = error.response.data as NestErrorBody | undefined;

    return new ApiError({
      status: error.response.status,
      message: readMessage(body),
      code: body?.error ?? error.code,
    });
  }

  const timedOut = TIMEOUT_CODES.has(error.code ?? '');

  return new ApiError({
    status: 0,
    message: i18n.t(timedOut ? 'errors.timeout' : 'errors.network'),
    code: error.code,
    isNetwork: true,
  });
}

function withLanguage(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  config.headers.set('Accept-Language', i18n.language);
  return config;
}

function rejectAsApiError(error: unknown): Promise<never> {
  return Promise.reject(isCancel(error) ? error : toApiError(error));
}

export class ApiService implements HttpClient {
  private static instance: ApiService | undefined;

  private readonly client: AxiosInstance;

  constructor(config: CreateAxiosDefaults = {}) {
    this.client = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL,
      timeout: REQUEST_TIMEOUT,
      ...config,
    });
    this.client.interceptors.request.use(withLanguage);
    this.client.interceptors.response.use((response) => response, rejectAsApiError);
  }

  static getInstance(): ApiService {
    ApiService.instance ??= new ApiService();
    return ApiService.instance;
  }

  async get(url: string, options?: RequestOptions): Promise<unknown> {
    const { data } = await this.client.get<unknown>(url, options);
    return data;
  }

  async post(url: string, body?: unknown, options?: RequestOptions): Promise<unknown> {
    const { data } = await this.client.post<unknown>(url, body, options);
    return data;
  }

  async patch(url: string, body?: unknown, options?: RequestOptions): Promise<unknown> {
    const { data } = await this.client.patch<unknown>(url, body, options);
    return data;
  }

  async put(url: string, body?: unknown, options?: RequestOptions): Promise<unknown> {
    const { data } = await this.client.put<unknown>(url, body, options);
    return data;
  }

  async delete(url: string, options?: RequestOptions): Promise<unknown> {
    const { data } = await this.client.delete<unknown>(url, options);
    return data;
  }
}
