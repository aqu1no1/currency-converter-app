import type { ReactElement, ReactNode } from 'react';

import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import {
  render,
  renderHook,
  type RenderHookOptions,
  type RenderOptions,
} from '@testing-library/react-native';

import { ApiProvider } from '@contexts/ApiProvider';
import type { HttpClient } from '@interfaces/http-client.interface';
import { ThemeProvider } from '@theme/ThemeProvider';

import { createFakeApiService } from './fake-api.service';
import { createTestQueryClient } from './query-client';

type ProvidersOptions = {
  queryClient?: QueryClient;
  api?: HttpClient;
};

function createWrapper({
  queryClient = createTestQueryClient(),
  api = createFakeApiService(),
}: ProvidersOptions) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ApiProvider api={api}>{children}</ApiProvider>
        </QueryClientProvider>
      </ThemeProvider>
    );
  }

  return { queryClient, api, Wrapper };
}

export function renderWithProviders(
  ui: ReactElement,
  { queryClient, api, ...options }: ProvidersOptions & Omit<RenderOptions, 'wrapper'> = {},
) {
  const providers = createWrapper({ queryClient, api });

  return {
    queryClient: providers.queryClient,
    api: providers.api,
    ...render(ui, { wrapper: providers.Wrapper, ...options }),
  };
}

export function renderHookWithProviders<Result, Props>(
  hook: (props: Props) => Result,
  {
    queryClient,
    api,
    ...options
  }: ProvidersOptions & Omit<RenderHookOptions<Props>, 'wrapper'> = {},
) {
  const providers = createWrapper({ queryClient, api });

  return {
    queryClient: providers.queryClient,
    api: providers.api,
    ...renderHook(hook, { wrapper: providers.Wrapper, ...options }),
  };
}
