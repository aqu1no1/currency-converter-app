import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useApi } from '@contexts/ApiProvider';
import type { HistoryParams } from '@dtos/history.dto';
import { ExchangeRateService } from '@services/exchange-rate.service';

export function historyQueryKey({ from, to, start, end }: HistoryParams) {
  return ['exchange-rates', 'history', from, to, start, end] as const;
}

export function useHistory(params: HistoryParams) {
  const api = useApi();
  const exchangeRateService = useMemo(() => new ExchangeRateService(api), [api]);

  return useQuery({
    queryKey: historyQueryKey(params),
    queryFn: ({ signal }) => exchangeRateService.history(params, signal),
  });
}
