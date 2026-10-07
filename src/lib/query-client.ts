import { QueryClient } from '@tanstack/react-query';

import { TIME_IN_MS } from '@constants/time.constants';
import { ApiError } from '@interfaces/api-error.interface';

const MAX_RETRIES = 2;

export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_RETRIES) return false;
  return error instanceof ApiError && (error.isNetwork || error.isServerError);
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * TIME_IN_MS.MINUTE,
        retry: shouldRetry,
      },
    },
  });
}

export const queryClient = createQueryClient();
