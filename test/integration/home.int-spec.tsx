import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { RefreshControl } from 'react-native';

import { act, renderRouter, screen, waitFor } from 'expo-router/testing-library';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Home from '@app/(tabs)/home';
import { ApiProvider } from '@contexts/ApiProvider';
import { PreferencesProvider } from '@contexts/PreferencesContext';
import { ThemeProvider } from '@theme/ThemeProvider';
import { createFakeApiService } from '@test/utils/fake-api.service';
import { createTestQueryClient } from '@test/utils/query-client';

function createApi() {
  const api = createFakeApiService();
  api.get.mockImplementation(async (url) => {
    if (url.endsWith('/latest/USD')) {
      return { base: 'USD', date: '2026-09-28', rates: { BRL: 5.193 } };
    }
    if (url.endsWith('/latest/BRL')) {
      return {
        base: 'BRL',
        date: '2026-09-28',
        rates: { EUR: 0.169741, GBP: 0.145128, ARS: 293.275, JPY: 30.32 },
      };
    }
    if (url.endsWith('/history')) {
      return {
        from: 'USD',
        to: 'BRL',
        history: [
          { date: '2026-09-01', rate: 5.38 },
          { date: '2026-09-28', rate: 5.41 },
        ],
      };
    }
    if (url.endsWith('/sync/status')) {
      return {
        lastRun: {
          type: 'DAILY',
          status: 'SUCCESS',
          startedAt: '2026-09-29T09:00:00.000Z',
          finishedAt: '2026-09-29T09:00:02.000Z',
          rowsInserted: 45,
          error: null,
        },
        latestRateDate: '2026-09-28',
      };
    }
    throw new Error(`Unexpected API path: ${url}`);
  });
  return api;
}

function createLayout(api: ReturnType<typeof createApi>) {
  const queryClient = createTestQueryClient();

  return function Layout() {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <ApiProvider api={api}>
              <PreferencesProvider>
                <Stack screenOptions={{ headerShown: false }} />
              </PreferencesProvider>
            </ApiProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  };
}

async function renderHome(api = createApi()) {
  const router = renderRouter({ _layout: createLayout(api), home: Home }, { initialUrl: '/home' });
  await act(async () => {});
  return { api, router };
}

describe('Home screen', () => {
  it('shows the latest pair, favorite currency rows and sync status', async () => {
    const { api } = await renderHome();

    expect(await screen.findByText('1 dólar americano em reais')).toBeTruthy();
    expect(screen.getByText('R$ 5,19')).toBeTruthy();
    expect(screen.getByText('EUR')).toBeTruthy();
    expect(screen.getByText('R$ 5,89')).toBeTruthy();
    expect(screen.getByText('R$ 6,89')).toBeTruthy();
    expect(screen.getByText('R$ 0,0034')).toBeTruthy();
    expect(screen.getByText('R$ 0,0330')).toBeTruthy();
    expect(await screen.findByText('Sincronizado hoje às 09:00')).toBeTruthy();
    expect(api.get).toHaveBeenCalledWith('/exchange-rates/history', {
      params: { from: 'USD', to: 'BRL', start: expect.any(String), end: expect.any(String) },
      signal: expect.any(AbortSignal),
    });
  });

  it('shows a retry action when the rates API is unavailable', async () => {
    const api = createFakeApiService();
    api.get.mockRejectedValue(new Error('offline'));

    await renderHome(api);

    expect(await screen.findByText('offline')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeTruthy();
  });

  it('refreshes the home queries with pull to refresh', async () => {
    const { api } = await renderHome();
    await screen.findByText('Sincronizado hoje às 09:00');
    const initialCalls = api.get.mock.calls.length;
    const refreshControl = screen.UNSAFE_getByType(RefreshControl);

    await act(async () => {
      await refreshControl.props.onRefresh();
    });

    await waitFor(() => expect(api.get.mock.calls.length).toBeGreaterThan(initialCalls));
  });
});
