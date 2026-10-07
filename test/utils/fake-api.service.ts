type Method = 'get' | 'post' | 'patch' | 'put' | 'delete';

export function createFakeApiService() {
  return {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  } satisfies Record<Method, jest.Mock>;
}

export type FakeApiService = ReturnType<typeof createFakeApiService>;
