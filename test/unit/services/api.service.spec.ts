import {
  AxiosError,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  isCancel,
} from 'axios';

import { ApiError } from '@interfaces/api-error.interface';
import { i18n } from '@lib/i18n';
import { ApiService, toApiError } from '@services/api.service';

function respond(status: number, data: unknown): AxiosAdapter {
  return async (config) => {
    const response: AxiosResponse = { data, status, statusText: '', headers: {}, config };

    if (status >= 400) {
      throw new AxiosError('Request failed', 'ERR_BAD_REQUEST', config, null, response);
    }

    return response;
  };
}

function fail(code: string): AxiosAdapter {
  return async (config) => {
    throw new AxiosError('Network Error', code, config);
  };
}

async function catchError(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error('expected the request to fail');
}

describe('ApiService', () => {
  afterEach(async () => {
    await i18n.changeLanguage('pt-BR');
  });

  it('returns only the response data', async () => {
    const api = new ApiService({ adapter: respond(200, { ok: true }) });

    await expect(api.get('/health')).resolves.toEqual({ ok: true });
  });

  it('sends the app language in Accept-Language', async () => {
    let sent: InternalAxiosRequestConfig | undefined;
    const api = new ApiService({
      adapter: async (config) => {
        sent = config;
        return { data: null, status: 200, statusText: '', headers: {}, config };
      },
    });

    await i18n.changeLanguage('en');
    await api.get('/currencies');

    expect(sent?.headers.get('Accept-Language')).toBe('en');
  });

  it('passes params and the timeout of 10 seconds', async () => {
    let sent: InternalAxiosRequestConfig | undefined;
    const api = new ApiService({
      adapter: async (config) => {
        sent = config;
        return { data: null, status: 200, statusText: '', headers: {}, config };
      },
    });

    await api.get('/exchange-rates/convert', { params: { from: 'EUR', to: 'BRL', amount: '10' } });

    expect(sent?.params).toEqual({ from: 'EUR', to: 'BRL', amount: '10' });
    expect(sent?.timeout).toBe(10_000);
  });

  it('turns a NestJS error with a text message into an ApiError', async () => {
    const api = new ApiService({
      adapter: respond(404, {
        statusCode: 404,
        error: 'Not Found',
        message: 'Moeda não suportado(a)',
      }),
    });

    const error = await catchError(api.get('/exchange-rates/latest/XYZ'));

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 404,
      code: 'Not Found',
      message: 'Moeda não suportado(a)',
      isNetwork: false,
    });
  });

  it('joins a NestJS validation message list into one text', async () => {
    const api = new ApiService({
      adapter: respond(400, {
        statusCode: 400,
        error: 'Bad Request',
        message: ['start precisa estar no formato AAAA-MM-DD', 'start não é uma data válida'],
      }),
    });

    const error = await catchError(api.get('/exchange-rates/history'));

    expect(error).toMatchObject({
      status: 400,
      message: 'start precisa estar no formato AAAA-MM-DD\nstart não é uma data válida',
    });
  });

  it('marks server errors so they can be retried', async () => {
    const api = new ApiService({
      adapter: respond(503, {
        statusCode: 503,
        error: 'Service Unavailable',
        message: 'Cotação indisponível',
      }),
    });

    const error = (await catchError(api.get('/exchange-rates/latest/BRL'))) as ApiError;

    expect(error.isServerError).toBe(true);
  });

  it('uses a translated message when the body has none', async () => {
    const api = new ApiService({ adapter: respond(500, 'Internal Server Error') });

    const error = await catchError(api.get('/sync/status'));

    expect(error).toMatchObject({ status: 500, message: i18n.t('errors.unexpected') });
  });

  it('flags network errors with status 0 and a translated message', async () => {
    const api = new ApiService({ adapter: fail('ERR_NETWORK') });

    const error = await catchError(api.get('/currencies'));

    expect(error).toMatchObject({
      status: 0,
      isNetwork: true,
      code: 'ERR_NETWORK',
      message: 'Sem conexão com o servidor. Confira sua internet e tente de novo.',
    });
  });

  it('flags timeouts as network errors with their own message', async () => {
    const api = new ApiService({ adapter: fail('ECONNABORTED') });

    const error = await catchError(api.get('/currencies'));

    expect(error).toMatchObject({ isNetwork: true, message: i18n.t('errors.timeout') });
  });

  it('lets cancellations through untouched', async () => {
    const api = new ApiService({ adapter: respond(200, {}) });
    const controller = new AbortController();
    controller.abort();

    const error = await catchError(api.get('/currencies', { signal: controller.signal }));

    expect(isCancel(error)).toBe(true);
    expect(error).not.toBeInstanceOf(ApiError);
  });

  it('keeps a single shared instance', () => {
    expect(ApiService.getInstance()).toBe(ApiService.getInstance());
  });

  it('wraps unknown errors as unexpected', () => {
    expect(toApiError(new Error('boom'))).toMatchObject({
      status: 0,
      isNetwork: false,
      message: i18n.t('errors.unexpected'),
    });
  });
});
