import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { onlineManager, QueryClient } from '@tanstack/react-query';

import { STORAGE_KEYS } from '@constants/storage';
import { TIME_IN_MS } from '@constants/time.constants';
import { ApiError } from '@interfaces/api-error.interface';

const MAX_RETRIES = 2;

export const QUERY_CACHE_MAX_AGE = TIME_IN_MS.WEEK;

export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_RETRIES || !onlineManager.isOnline()) return false;
  return error instanceof ApiError && (error.isNetwork || error.isServerError);
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * TIME_IN_MS.MINUTE,
        gcTime: QUERY_CACHE_MAX_AGE,
        retry: shouldRetry,
      },
    },
  });
}

export const queryClient = createQueryClient();

export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: STORAGE_KEYS.queryCache,
});
