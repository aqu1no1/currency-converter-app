import { createContext, type ReactNode, useContext } from 'react';

import type { HttpClient } from '@interfaces/http-client.interface';
import { ApiService } from '@services/api.service';

const ApiContext = createContext<HttpClient | null>(null);

type ApiProviderProps = {
  api?: HttpClient;

  children: ReactNode;
};

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
