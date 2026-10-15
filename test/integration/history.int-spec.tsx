import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

import { act, fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import History from '@app/(tabs)/history';
import { ApiProvider } from '@contexts/ApiProvider';
import { PreferencesProvider } from '@contexts/PreferencesContext';
import type { HistoryParams } from '@dtos/history.dto';
import { ThemeProvider } from '@theme/ThemeProvider';
import { ApiError } from '@interfaces/api-error.interface';
import { createFakeApiService } from '@test/utils/fake-api.service';
import { createTestQueryClient } from '@test/utils/query-client';
import { historyRange } from '@utils/history.util';

const HISTORY = [
  { date: '2026-09-01', rate: 5.38 },
  { date: '2026-09-10', rate: 5.3 },
  { date: '2026-09-20', rate: 5.45 },
  { date: '2026-09-28', rate: 5.41 },
];

function createApi() {
  const api = createFakeApiService();
  api.get.mockImplementation(async (url, config) => {
    if (url !== '/exchange-rates/history') throw new Error(`Unexpected API path: ${url}`);
    const { from, to } = (config?.params ?? {}) as HistoryParams;
    return { from, to, history: to === 'ARS' ? [] : HISTORY };
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

async function renderHistory({ api = createApi(), initialUrl = '/history' } = {}) {
  const router = renderRouter({ _layout: createLayout(api), history: History }, { initialUrl });
  await act(async () => {});
  return { api, router };
}

function lastParams(api: ReturnType<typeof createFakeApiService>) {
  return api.get.mock.calls.at(-1)?.[1]?.params as HistoryParams;
}

describe('History screen', () => {
  it('shows USD → BRL in the last 30 days by default', async () => {
    const { api } = await renderHistory();

    expect(await screen.findByText('▲ 0,56% em 30 dias')).toBeTruthy();
    expect(screen.getByText('Desde 01/01/2000')).toBeTruthy();
    expect(screen.getByText('1 USD em BRL')).toBeTruthy();
    expect(screen.getByText('Resumo do período')).toBeTruthy();
    expect(screen.getAllByText('5,4100')).toHaveLength(2);
    expect(screen.getByText('5,3000')).toBeTruthy();
    expect(screen.getByText('10/09/2026')).toBeTruthy();
    expect(screen.getByText('20/09/2026')).toBeTruthy();
    expect(screen.getByLabelText('Alta de 0,56% em 30 dias')).toBeTruthy();
    expect(lastParams(api)).toEqual({ from: 'USD', to: 'BRL', ...historyRange('month') });
  });

  it('reads the pair from the route', async () => {
    const { api } = await renderHistory({ initialUrl: '/history?from=BRL&to=EUR' });

    expect(await screen.findByText('1 BRL em EUR')).toBeTruthy();
    expect(lastParams(api)).toMatchObject({ from: 'BRL', to: 'EUR' });
  });

  it('loads another period when it is selected', async () => {
    const { api } = await renderHistory();
    await screen.findByText('▲ 0,56% em 30 dias');

    await act(async () => {
      fireEvent.press(screen.getByRole('radio', { name: '7 dias' }));
    });

    await waitFor(() => expect(lastParams(api)).toMatchObject(historyRange('week')));
    expect(await screen.findByText('▲ 0,56% em 7 dias')).toBeTruthy();
  });

  it('swaps the pair', async () => {
    const { api, router } = await renderHistory();
    await screen.findByText('1 USD em BRL');

    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Inverter par' }));
    });

    expect(await screen.findByText('1 BRL em USD')).toBeTruthy();
    expect(lastParams(api)).toMatchObject({ from: 'BRL', to: 'USD' });
    expect(router.getSearchParams()).toEqual({ from: 'BRL', to: 'USD' });
  });

  it('picks a currency from the modal', async () => {
    const { api } = await renderHistory();
    await screen.findByText('1 USD em BRL');

    await act(async () => {
      fireEvent.press(
        screen.getByRole('button', { name: 'Moeda de origem: Dólar americano (USD)' }),
      );
    });
    expect(screen.getByText('Converter de')).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Dólar americano (USD)' })).toBeSelected();

    await act(async () => {
      fireEvent.press(screen.getByRole('radio', { name: 'Euro (EUR)' }));
    });

    expect(await screen.findByText('1 EUR em BRL')).toBeTruthy();
    expect(lastParams(api)).toMatchObject({ from: 'EUR', to: 'BRL' });
    expect(screen.queryByText('Converter de')).toBeNull();
  });

  it('shows the empty state when the period has no rates', async () => {
    await renderHistory({ initialUrl: '/history?from=USD&to=ARS' });

    expect(await screen.findByText('Sem cotações nesse período')).toBeTruthy();
    expect(screen.getByText('1 USD em ARS · 30 dias')).toBeTruthy();
    expect(screen.queryByText('Resumo do período')).toBeNull();
    expect(screen.getByRole('radio', { name: '1 ano' })).toBeTruthy();
  });

  it('shows the unavailable state with retry when the history cannot be loaded', async () => {
    const api = createFakeApiService();
    api.get.mockRejectedValue(new ApiError({ status: 500, message: 'down' }));
    await renderHistory({ api });

    expect(await screen.findByText('Não foi possível carregar as cotações')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeTruthy();
  });
});
