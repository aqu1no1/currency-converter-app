import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useApi } from '@contexts/ApiProvider';
import { SyncService } from '@services/sync.service';

export const syncRunsQueryKey = (perPage: number) => ['sync', 'runs', perPage] as const;

/**
 * Busca as execuções mais recentes da sincronização na API (`GET /sync`).
 *
 * @example
 * ```tsx
 * const runs = useSyncRuns(4);
 * const items = runs.data?.data ?? [];
 * ```
 */
export function useSyncRuns(perPage: number) {
  const api = useApi();
  const syncService = useMemo(() => new SyncService(api), [api]);

  return useQuery({
    queryKey: syncRunsQueryKey(perPage),
    queryFn: ({ signal }) => syncService.list({ perPage }, signal),
  });
}
