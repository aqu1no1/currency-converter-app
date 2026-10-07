import { createContext, type ReactNode, useContext } from 'react';

import type { HttpClient } from '@interfaces/http-client.interface';
import { ApiService } from '@services/api.service';

const ApiContext = createContext<HttpClient | null>(null);

/** Props do componente ApiProvider. */
type ApiProviderProps = {
  /** Cliente HTTP entregue pelo `useApi()`. Nos testes, entra o `createFakeApiService()`. @default ApiService.getInstance() */
  api?: HttpClient;
  /** Árvore que passa a enxergar o cliente HTTP. */
  children: ReactNode;
};

/**
 * Entrega o cliente HTTP do app para os hooks, que criam os services a partir
 * dele. Fica no `_layout.tsx`, dentro do `QueryClientProvider`.
 *
 * @example
 * ```tsx
 * <ApiProvider>
 *   <Stack />
 * </ApiProvider>
 *
 * const api = useApi();
 * const exchangeRateService = useMemo(() => new ExchangeRateService(api), [api]);
 * ```
 */
export function ApiProvider({ api = ApiService.getInstance(), children }: ApiProviderProps) {
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export function useApi(): HttpClient {
  const api = useContext(ApiContext);

  if (!api) {
    throw new Error('useApi precisa estar dentro do ApiProvider');
  }

  return api;
}
