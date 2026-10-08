import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { act, fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';
import { AccessibilityInfo } from 'react-native';

import Converter from '@app/(tabs)/converter';
import Welcome from '@app/index';
import Onboarding from '@app/onboarding/index';
import { STORAGE_KEYS } from '@constants/storage';
import { ApiProvider } from '@contexts/ApiProvider';
import { ThemeProvider } from '@theme/ThemeProvider';
import { createFakeApiService } from '@test/utils/fake-api.service';
import { createTestQueryClient } from '@test/utils/query-client';

function createLayout(api = createFakeApiService()) {
  api.get.mockResolvedValue([]);
  const queryClient = createTestQueryClient();

  return function Layout() {
    return (
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ApiProvider api={api}>
            <Stack screenOptions={{ headerShown: false }} />
          </ApiProvider>
        </QueryClientProvider>
      </ThemeProvider>
    );
  };
}

async function renderWelcome(api = createFakeApiService()) {
  const router = renderRouter(
    {
      _layout: createLayout(api),
      index: Welcome,
      'onboarding/index': Onboarding,
      '(tabs)/converter': Converter,
    },
    { initialUrl: '/' },
  );
  await act(async () => {});
  return router;
}

describe('Welcome screen', () => {
  beforeEach(() => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows the texts in the phone language', async () => {
    await renderWelcome();

    expect(screen.getByRole('header', { name: 'Converter' })).toBeTruthy();
    expect(screen.getByText(/Converta entre 10 moedas/)).toBeTruthy();
    expect(screen.getByText('Taxas de referência. Não incluem spread nem tarifas.')).toBeTruthy();
  });

  it('lists the 10 supported currencies', async () => {
    await renderWelcome();

    for (const code of ['USD', 'BRL', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'ARS']) {
      expect(screen.getByText(code)).toBeTruthy();
    }
  });

  it('goes to the onboarding on "Começar"', async () => {
    const router = await renderWelcome();

    fireEvent.press(screen.getByRole('button', { name: 'Começar' }));

    expect(router.getPathname()).toBe('/onboarding');
  });

  it('goes to the converter on "Converter agora"', async () => {
    const router = await renderWelcome();

    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Converter agora' }));
      await Promise.resolve();
    });

    await waitFor(() => expect(router.getPathname()).toBe('/converter'));
    expect(await AsyncStorage.getItem(STORAGE_KEYS.welcomeCompleted)).toBe('true');
  });

  it('opens the converter directly after the welcome was completed', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.welcomeCompleted, 'true');

    const router = await renderWelcome();

    expect(router.getPathname()).toBe('/converter');
    expect(screen.queryByRole('button', { name: 'Começar' })).toBeNull();
  });

  it('uses currencies returned by the API when available', async () => {
    const api = createFakeApiService();
    api.get.mockResolvedValue([
      {
        id: '50ad2809-1640-4a6d-8af8-f2c7dfed9a77',
        code: 'USD',
        name: 'US Dollar',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ]);

    await renderWelcome(api);

    expect(await screen.findByText('USD')).toBeTruthy();
    expect(api.get).toHaveBeenCalledWith('/currencies', expect.anything());
  });

  it('keeps the local currency list when the API request fails', async () => {
    const api = createFakeApiService();
    api.get.mockRejectedValue(new Error('network error'));

    await renderWelcome(api);

    for (const code of ['USD', 'BRL', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'ARS']) {
      expect(screen.getByText(code)).toBeTruthy();
    }
  });
});
