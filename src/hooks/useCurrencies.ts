import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useApi } from '@contexts/ApiProvider';
import { CurrencyService } from '@services/currency.service';

export const currenciesQueryKey = ['currencies'] as const;

/**
 * Busca as moedas aceitas pela API (`GET /currencies`).
 *
 * @example
 * ```tsx
 * const { data: currencies } = useCurrencies();
 * ```
 */
export function useCurrencies() {
  const api = useApi();
  const currencyService = useMemo(() => new CurrencyService(api), [api]);

  return useQuery({
    queryKey: currenciesQueryKey,
    queryFn: ({ signal }) => currencyService.list(signal),
  });
}
