import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { RefreshControl } from 'react-native';

import { act, fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Rates from '@app/(tabs)/rates';
import { ApiProvider } from '@contexts/ApiProvider';
import { PreferencesProvider } from '@contexts/PreferencesContext';
import { ThemeProvider } from '@theme/ThemeProvider';
import { ApiError } from '@interfaces/api-error.interface';
import { createFakeApiService } from '@test/utils/fake-api.service';
import { createTestQueryClient } from '@test/utils/query-client';

const LATEST = {
  BRL: {
    base: 'BRL',
    date: '2026-09-28',
    rates: {
      USD: 0.192566,
      EUR: 0.169741,
      GBP: 0.145128,
      JPY: 30.32,
      CAD: 0.265939,
      AUD: 0.293472,
      CHF: 0.154439,
      CNY: 1.37204,
      ARS: 279.664,
    },
  },
  EUR: {
    base: 'EUR',
    date: '2026-09-28',
    rates: {
      USD: 1.13999,
      BRL: 5.9131,
      GBP: 0.85272,
      JPY: 179.52,
      CAD: 1.5743,
      AUD: 1.7373,
      CHF: 0.91425,
      CNY: 8.1225,
      ARS: 1655.6,
    },
  },
} as const;

function createApi() {
  const api = createFakeApiService();
  api.get.mockImplementation(async (url) => {
    const base = url.split('/').at(-1) as keyof typeof LATEST;
    if (url.includes('/exchange-rates/latest/') && LATEST[base]) return LATEST[base];
    throw new Error(`Unexpected API path: ${url}`);
  });
  return api;
}

function createLayout(api: ReturnType<typeof createFakeApiService>) {
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

async function renderRates(api = createApi()) {
  const router = renderRouter(
    { _layout: createLayout(api), rates: Rates, history: () => null },
    { initialUrl: '/rates' },
  );
  await act(async () => {});
  return { api, router };
}

describe('Rates screen', () => {
  it('shows what 1 unit of the primary currency is worth in each other currency', async () => {
    await renderRates();

    expect(await screen.findByText('1 USD = 5,1930 BRL')).toBeTruthy();
    expect(screen.getByText('Cotações de 28/09/2026')).toBeTruthy();
    expect(screen.getByText('Quanto vale 1 BRL em cada moeda')).toBeTruthy();
    expect(screen.getByText('0,1926')).toBeTruthy();
    expect(screen.getByText('279,66')).toBeTruthy();
    expect(
      screen.getByText('Taxas médias de referência. Não incluem spread nem tarifas.'),
    ).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Real brasileiro (BRL)' })).toBeSelected();
    expect(screen.queryByRole('button', { name: /^Real brasileiro:/ })).toBeNull();
  });

  it('switches the base currency and lists the new rates', async () => {
    const { api } = await renderRates();
    await screen.findByText('1 USD = 5,1930 BRL');

    await act(async () => {
      fireEvent.press(screen.getByRole('radio', { name: 'Euro (EUR)' }));
    });

    await waitFor(() =>
      expect(api.get).toHaveBeenCalledWith('/exchange-rates/latest/EUR', expect.anything()),
    );
    expect(await screen.findByText('5,9131')).toBeTruthy();
    expect(screen.getByText('1 BRL = 0,1691 EUR')).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Euro (EUR)' })).toBeSelected();
    expect(screen.queryByRole('button', { name: /^Euro:/ })).toBeNull();
  });

  it('opens the pair history when a currency is tapped', async () => {
    const { router } = await renderRates();
    await screen.findByText('1 USD = 5,1930 BRL');

    await act(async () => {
      fireEvent.press(
        screen.getByRole('button', { name: 'Dólar americano: 1 BRL = 0,1926 USD. Ver histórico' }),
      );
    });

    expect(router.getPathname()).toBe('/history');
    expect(router.getSearchParams()).toEqual({ from: 'BRL', to: 'USD' });
  });

  it('shows the unavailable state with retry when the rates cannot be loaded', async () => {
    const api = createFakeApiService();
    api.get.mockRejectedValue(new ApiError({ status: 500, message: 'down' }));
    await renderRates(api);

    expect(await screen.findByText('Não foi possível carregar as cotações')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeTruthy();
  });

  it('refreshes the rates with pull to refresh', async () => {
    const { api } = await renderRates();
    await screen.findByText('1 USD = 5,1930 BRL');
    const initialCalls = api.get.mock.calls.length;
    const refreshControl = screen.UNSAFE_getByType(RefreshControl);

    await act(async () => {
      await refreshControl.props.onRefresh();
    });

    await waitFor(() => expect(api.get.mock.calls.length).toBeGreaterThan(initialCalls));
  });
});
