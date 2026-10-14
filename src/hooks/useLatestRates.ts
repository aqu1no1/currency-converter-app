import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useApi } from '@contexts/ApiProvider';
import { ExchangeRateService } from '@services/exchange-rate.service';

export function latestRatesQueryKey(base: string) {
  return ['exchange-rates', 'latest', base] as const;
}

/**
 * Busca as cotações mais recentes a partir de uma moeda-base (`GET /exchange-rates/latest/:base`).
 *
 * Trocar a base cancela a chamada anterior. O Converter usa uma chamada por moeda
 * ativa e faz as contas no aparelho.
 *
 * @example
 * ```tsx
 * const latest = useLatestRates('BRL');
 * const euroRate = latest.data?.rates.EUR;
 * ```
 */
export function useLatestRates(base: string) {
  const api = useApi();
  const exchangeRateService = useMemo(() => new ExchangeRateService(api), [api]);

  return useQuery({
    queryKey: latestRatesQueryKey(base),
    queryFn: ({ signal }) => exchangeRateService.latest(base, signal),
  });
}
