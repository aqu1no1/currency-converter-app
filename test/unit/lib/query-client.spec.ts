import { ApiError } from '@interfaces/api-error.interface';
import { createQueryClient, shouldRetry } from '@lib/query-client';

const network = new ApiError({ status: 0, message: 'offline', isNetwork: true });
const server = new ApiError({ status: 503, message: 'down' });
const client = new ApiError({ status: 404, message: 'not found' });

describe('query client', () => {
  it('retries network and server errors up to 2 times', () => {
    expect(shouldRetry(0, network)).toBe(true);
    expect(shouldRetry(1, server)).toBe(true);
    expect(shouldRetry(2, network)).toBe(false);
  });

  it('does not retry client errors or unknown errors', () => {
    expect(shouldRetry(0, client)).toBe(false);
    expect(shouldRetry(0, new Error('boom'))).toBe(false);
  });

  it('keeps data fresh for 5 minutes', () => {
    expect(createQueryClient().getDefaultOptions().queries?.staleTime).toBe(5 * 60 * 1000);
  });
});
