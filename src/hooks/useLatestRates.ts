import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useApi } from '@contexts/ApiProvider';
import { ExchangeRateService } from '@services/exchange-rate.service';

export function latestRatesQueryKey(base: string) {
  return ['exchange-rates', 'latest', base] as const;
}

export function useLatestRates(base: string) {
  const api = useApi();
  const exchangeRateService = useMemo(() => new ExchangeRateService(api), [api]);

  return useQuery({
    queryKey: latestRatesQueryKey(base),
    queryFn: ({ signal }) => exchangeRateService.latest(base, signal),
  });
}
