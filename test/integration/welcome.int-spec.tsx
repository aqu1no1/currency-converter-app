import { Stack } from 'expo-router';
import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';
import { AccessibilityInfo } from 'react-native';

import Converter from '@app/(tabs)/converter';
import Welcome from '@app/index';
import Onboarding from '@app/onboarding/index';
import { ThemeProvider } from '@theme/ThemeProvider';

function Layout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}

async function renderWelcome() {
  const router = renderRouter(
    {
      _layout: Layout,
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

    fireEvent.press(screen.getByRole('button', { name: 'Converter agora' }));

    expect(router.getPathname()).toBe('/converter');
  });
});
