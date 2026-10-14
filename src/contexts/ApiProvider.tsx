import { createContext, type ReactNode, useContext } from 'react';

import type { HttpClient } from '@interfaces/http-client.interface';
import { ApiService } from '@services/api.service';

const ApiContext = createContext<HttpClient | null>(null);

type ApiProviderProps = {
  api?: HttpClient;

  children: ReactNode;
};

/**
 * [EN] Provides the HTTP client to the component tree.
 * [PT-BR] Disponibiliza o cliente HTTP para a árvore de componentes.
 *
 * @example
 * ```tsx
 * <ApiProvider><Stack /></ApiProvider>
 * ```
 */
export function ApiProvider({ api = ApiService.getInstance(), children }: ApiProviderProps) {
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

/**
 * [EN] Returns the HTTP client provided by the nearest ApiProvider.
 * [PT-BR] Retorna o cliente HTTP disponibilizado pelo ApiProvider mais próximo.
 */
export function useApi(): HttpClient {
  const api = useContext(ApiContext);

  if (!api) {
    throw new Error('useApi precisa estar dentro do ApiProvider');
  }

  return api;
}
