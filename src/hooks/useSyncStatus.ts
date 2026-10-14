import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useApi } from '@contexts/ApiProvider';
import { SyncService } from '@services/sync.service';

export const syncStatusQueryKey = ['sync', 'status'] as const;

/**
 * Busca o status da sincronização das cotações na API (`GET /sync/status`).
 *
 * @example
 * ```tsx
 * const sync = useSyncStatus();
 * const lastRun = sync.data?.lastRun ?? null;
 * ```
 */
export function useSyncStatus() {
  const api = useApi();
  const syncService = useMemo(() => new SyncService(api), [api]);

  return useQuery({
    queryKey: syncStatusQueryKey,
    queryFn: ({ signal }) => syncService.status(signal),
  });
}
