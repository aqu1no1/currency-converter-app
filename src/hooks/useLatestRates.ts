import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useApi } from '@contexts/ApiProvider';
import { ExchangeRateService } from '@services/exchange-rate.service';

export function latestRatesQueryKey(base: string) {
  return ['exchange-rates', 'latest', base] as const;
}
/**
 * Loads the latest exchange rates for a selected base currency.
 * Carrega as cotações mais recentes para a moeda-base selecionada.
 */

export function useLatestRates(base: string) {
  const api = useApi();
  const exchangeRateService = useMemo(() => new ExchangeRateService(api), [api]);

  return useQuery({
    queryKey: latestRatesQueryKey(base),
    queryFn: ({ signal }) => exchangeRateService.latest(base, signal),
  });
}
