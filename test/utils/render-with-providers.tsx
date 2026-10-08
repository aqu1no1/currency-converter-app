import { useEffect, type ReactElement, type ReactNode } from 'react';

import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import {
  render,
  renderHook,
  type RenderHookOptions,
  type RenderOptions,
  waitFor,
} from '@testing-library/react-native';

import { ApiProvider } from '@contexts/ApiProvider';
import type { HttpClient } from '@interfaces/http-client.interface';
import { ThemeProvider, useTheme } from '@theme/ThemeProvider';

import { createFakeApiService } from './fake-api.service';
import { createTestQueryClient } from './query-client';

type ProvidersOptions = {
  queryClient?: QueryClient;
  api?: HttpClient;
};

function ThemeReadySignal({ onReady }: { onReady: () => void }) {
  const { ready } = useTheme();

  useEffect(() => {
    if (ready) onReady();
  }, [onReady, ready]);

  return null;
}

function createWrapper({
  queryClient = createTestQueryClient(),
  api = createFakeApiService(),
  onThemeReady,
}: ProvidersOptions & { onThemeReady: () => void }) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ThemeProvider>
        <ThemeReadySignal onReady={onThemeReady} />
        <QueryClientProvider client={queryClient}>
          <ApiProvider api={api}>{children}</ApiProvider>
        </QueryClientProvider>
      </ThemeProvider>
    );
  }

  return { queryClient, api, Wrapper };
}

export async function renderWithProviders(
  ui: ReactElement,
  { queryClient, api, ...options }: ProvidersOptions & Omit<RenderOptions, 'wrapper'> = {},
) {
  let themeIsReady = false;
  const providers = createWrapper({ queryClient, api, onThemeReady: () => (themeIsReady = true) });
  const rendered = render(ui, { wrapper: providers.Wrapper, ...options });
  await waitFor(() => expect(themeIsReady).toBe(true));

  return {
    queryClient: providers.queryClient,
    api: providers.api,
    ...rendered,
  };
}

export async function renderHookWithProviders<Result, Props>(
  hook: (props: Props) => Result,
  {
    queryClient,
    api,
    ...options
  }: ProvidersOptions & Omit<RenderHookOptions<Props>, 'wrapper'> = {},
) {
  let themeIsReady = false;
  const providers = createWrapper({ queryClient, api, onThemeReady: () => (themeIsReady = true) });
  const rendered = renderHook(hook, { wrapper: providers.Wrapper, ...options });
  await waitFor(() => expect(themeIsReady).toBe(true));

  return {
    queryClient: providers.queryClient,
    api: providers.api,
    ...rendered,
  };
}
