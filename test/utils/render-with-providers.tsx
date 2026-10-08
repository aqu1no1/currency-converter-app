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
import { PreferencesProvider, usePreferences } from '@contexts/PreferencesContext';
import type { HttpClient } from '@interfaces/http-client.interface';
import { ThemeProvider, useTheme } from '@theme/ThemeProvider';

import { createFakeApiService } from './fake-api.service';
import { createTestQueryClient } from './query-client';

type ProvidersOptions = {
  queryClient?: QueryClient;
  api?: HttpClient;
};

function ProvidersReadySignal({ onReady }: { onReady: () => void }) {
  const { ready: themeReady } = useTheme();
  const { ready: preferencesReady } = usePreferences();

  useEffect(() => {
    if (themeReady && preferencesReady) onReady();
  }, [onReady, preferencesReady, themeReady]);

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
        <QueryClientProvider client={queryClient}>
          <ApiProvider api={api}>
            <PreferencesProvider>
              <ProvidersReadySignal onReady={onThemeReady} />
              {children}
            </PreferencesProvider>
          </ApiProvider>
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
