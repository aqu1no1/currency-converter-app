import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useApi } from '@contexts/ApiProvider';
import { SyncService } from '@services/sync.service';

export const syncStatusQueryKey = ['sync', 'status'] as const;
/**
 * Loads the latest synchronization status.
 * Carrega o status da sincronização mais recente.
 */

export function useSyncStatus() {
  const api = useApi();
  const syncService = useMemo(() => new SyncService(api), [api]);

  return useQuery({
    queryKey: syncStatusQueryKey,
    queryFn: ({ signal }) => syncService.status(signal),
  });
}
