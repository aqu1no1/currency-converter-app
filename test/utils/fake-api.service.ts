import type { HttpClient } from '@interfaces/http-client.interface';

export type FakeApiService = {
  [Method in keyof HttpClient]: jest.MockedFunction<HttpClient[Method]>;
};

export function createFakeApiService(): FakeApiService {
  return {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
}
