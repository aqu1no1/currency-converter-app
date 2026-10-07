type Method = 'get' | 'post' | 'patch' | 'put' | 'delete';

/**
 * ApiService falso para injetar nos services nos testes, sem rede.
 * Cada método é um jest.fn: configure a resposta com `mockResolvedValueOnce`.
 */
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
