import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { act, fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Home from '@app/(tabs)/home';
import Settings from '@app/(tabs)/settings';
import OnboardingLayout from '@app/onboarding/_layout';
import OnboardingFirstStep from '@app/onboarding/index';
import OnboardingHistoryStep from '@app/onboarding/history';
import OnboardingPreferencesStep from '@app/onboarding/preferences';
import { STORAGE_KEYS } from '@constants/storage';
import { ApiProvider } from '@contexts/ApiProvider';
import { PreferencesProvider } from '@contexts/PreferencesContext';
import { i18n } from '@lib/i18n';
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
        rates: { USD: 0.1926, EUR: 0.1689, GBP: 0.1441, ARS: 279.78 },
      };
    }
    if (url.endsWith('/latest/EUR')) {
      return {
        base: 'EUR',
        date: '2026-09-28',
        rates: { BRL: 5.89, USD: 1.17, GBP: 0.86, ARS: 1650, JPY: 174 },
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
    if (url.endsWith('/history')) {
      return {
        from: 'USD',
        to: 'BRL',
        history: [
          { date: '2025-10-01', rate: 5.1 },
          { date: '2026-04-01', rate: 5.3 },
          { date: '2026-09-28', rate: 5.19 },
        ],
      };
    }
    throw new Error(`Unexpected API path: ${url}`);
  });
  return api;
}

function createRootLayout(api = createApi()) {
  const queryClient = createTestQueryClient();

  return function RootLayout() {
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

async function renderOnboarding(api = createApi()) {
  const router = renderRouter(
    {
      _layout: createRootLayout(api),
      'onboarding/_layout': OnboardingLayout,
      'onboarding/index': OnboardingFirstStep,
      'onboarding/history': OnboardingHistoryStep,
      'onboarding/preferences': OnboardingPreferencesStep,
      '(tabs)/home': Home,
      '(tabs)/settings': Settings,
    },
    { initialUrl: '/onboarding' },
  );

  return { api, router };
}

describe('Onboarding flow', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('pt-BR');
  });

  it('navigates through all three steps', async () => {
    const { router } = await renderOnboarding();

    expect(await screen.findByRole('header', { name: 'Uma conta, dez moedas' })).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
    await waitFor(() => expect(router.getPathname()).toBe('/onboarding/history'));
    expect(await screen.findByRole('header', { name: 'Veja como o câmbio mudou' })).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
    await waitFor(() => expect(router.getPathname()).toBe('/onboarding/preferences'));
    expect(await screen.findByRole('header', { name: 'Do seu jeito' })).toBeTruthy();
  });

  it('lets the user skip the first step and marks onboarding complete', async () => {
    const { router } = await renderOnboarding();

    await screen.findByRole('header', { name: 'Uma conta, dez moedas' });
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Pular' }));
    });

    await waitFor(() => expect(router.getPathname()).toBe('/home'));
    expect(await AsyncStorage.getItem(STORAGE_KEYS.welcomeCompleted)).toBe('true');
  });

  it('returns from the second step and lets the user skip there too', async () => {
    const { router } = await renderOnboarding();

    await screen.findByRole('header', { name: 'Uma conta, dez moedas' });
    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
    await waitFor(() => expect(router.getPathname()).toBe('/onboarding/history'));

    fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));
    await waitFor(() => expect(router.getPathname()).toBe('/onboarding'));
    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
    await waitFor(() => expect(router.getPathname()).toBe('/onboarding/history'));
    fireEvent.press(screen.getByRole('button', { name: 'Pular' }));

    await waitFor(() => expect(router.getPathname()).toBe('/home'));
    expect(await AsyncStorage.getItem(STORAGE_KEYS.welcomeCompleted)).toBe('true');
  });

  it('saves the chosen currency and language when onboarding completes', async () => {
    const { router } = await renderOnboarding();

    await screen.findByRole('header', { name: 'Uma conta, dez moedas' });
    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
    await waitFor(() => expect(router.getPathname()).toBe('/onboarding/history'));
    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
    await waitFor(() => expect(router.getPathname()).toBe('/onboarding/preferences'));

    fireEvent.press(screen.getByRole('radio', { name: 'Euro (EUR)' }));
    for (const label of [
      'Dólar americano (USD)',
      'Real brasileiro (BRL)',
      'Euro (EUR)',
      'Libra esterlina (GBP)',
      'Iene japonês (JPY)',
      'Dólar canadense (CAD)',
      'Dólar australiano (AUD)',
      'Franco suíço (CHF)',
      'Yuan chinês (CNY)',
      'Peso argentino (ARS)',
    ]) {
      expect(screen.getByRole('radio', { name: label })).toBeTruthy();
    }
    fireEvent.press(screen.getByRole('radio', { name: 'English' }));
    await screen.findByRole('button', { name: 'Get started' });
    fireEvent.press(screen.getByRole('button', { name: 'Get started' }));

    await waitFor(() => expect(router.getPathname()).toBe('/home'));
    expect(await AsyncStorage.getItem(STORAGE_KEYS.primaryCurrency)).toBe('EUR');
    expect(await AsyncStorage.getItem(STORAGE_KEYS.language)).toBe('en');
    expect(await AsyncStorage.getItem(STORAGE_KEYS.welcomeCompleted)).toBe('true');
    expect(await screen.findByText('Your currencies in Euro')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Settings' }));
    await waitFor(() => expect(router.getPathname()).toBe('/settings'));
    expect(screen.getByText('Main currency')).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Euro (EUR)' })).toBeSelected();
    expect(screen.getByText('English')).toBeTruthy();
  });

  it('uses example conversion rows when the rates API is offline', async () => {
    const api = createApi();
    api.get.mockRejectedValue(new Error('offline'));
    await renderOnboarding(api);

    expect(await screen.findByText('USD')).toBeTruthy();
    expect(screen.getByText('EUR')).toBeTruthy();
    expect(screen.getByText('GBP')).toBeTruthy();
    expect(screen.getByText('ARS')).toBeTruthy();
  });

  it('renders the API rates in the four currencies shown in the HTML design', async () => {
    const api = createFakeApiService();
    api.get.mockResolvedValue({
      base: 'BRL',
      date: '2026-09-28',
      rates: { USD: 0.2, EUR: 0.1, GBP: 0.3, ARS: 2 },
    });

    await renderOnboarding(api);

    expect(await screen.findByText('US$ 20,00')).toBeTruthy();
    expect(screen.getByText('€ 10,00')).toBeTruthy();
    expect(screen.getByText('£ 30,00')).toBeTruthy();
    expect(screen.getByText('ARS 200,00')).toBeTruthy();
    expect(api.get).toHaveBeenCalledWith(
      '/exchange-rates/latest/BRL',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('uses an example history series when history is unavailable', async () => {
    const api = createFakeApiService();
    api.get.mockImplementation(async (url) => {
      if (url.endsWith('/latest/BRL')) {
        return { base: 'BRL', date: '2026-09-28', rates: { USD: 0.1926 } };
      }
      throw new Error('offline');
    });
    const { router } = await renderOnboarding(api);

    await screen.findByRole('header', { name: 'Uma conta, dez moedas' });
    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
    await waitFor(() => expect(router.getPathname()).toBe('/onboarding/history'));

    expect(await screen.findByText('5,0200')).toBeTruthy();
    expect(screen.getByText('2000')).toBeTruthy();
  });
});
