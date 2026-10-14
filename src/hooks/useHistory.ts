import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useApi } from '@contexts/ApiProvider';
import type { HistoryParams } from '@dtos/history.dto';
import { ExchangeRateService } from '@services/exchange-rate.service';

export function historyQueryKey({ from, to, start, end }: HistoryParams) {
  return ['exchange-rates', 'history', from, to, start, end] as const;
}

/**
 * Busca o histórico de cotações de um par num período (`GET /exchange-rates/history`).
 *
 * As datas `start` e `end` vão no formato `AAAA-MM-DD`. Mudar o par ou o período
 * cancela a chamada anterior.
 *
 * @example
 * ```tsx
 * const history = useHistory({ from: 'USD', to: 'BRL', start, end });
 * ```
 */
export function useHistory(params: HistoryParams) {
  const api = useApi();
  const exchangeRateService = useMemo(() => new ExchangeRateService(api), [api]);

  return useQuery({
    queryKey: historyQueryKey(params),
    queryFn: ({ signal }) => exchangeRateService.history(params, signal),
  });
}
