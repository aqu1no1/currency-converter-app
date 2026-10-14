import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { act, fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import TabsLayout from '@app/(tabs)/_layout';
import Home from '@app/(tabs)/home';
import Converter from '@app/(tabs)/converter';
import Rates from '@app/(tabs)/rates';
import History from '@app/(tabs)/history';
import Settings from '@app/(tabs)/settings';
import { ApiProvider } from '@contexts/ApiProvider';
import { PreferencesProvider } from '@contexts/PreferencesContext';
import { ThemeProvider } from '@theme/ThemeProvider';
import { createFakeApiService } from '@test/utils/fake-api.service';
import { createTestQueryClient } from '@test/utils/query-client';

function createLayout() {
  const queryClient = createTestQueryClient();
  const api = createFakeApiService();
  api.get.mockRejectedValue(new Error('offline'));

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

describe('main tab navigation', () => {
  it('shows all five translated tabs and navigates between them', async () => {
    const router = renderRouter(
      {
        _layout: createLayout(),
        '(tabs)/_layout': TabsLayout,
        '(tabs)/home': Home,
        '(tabs)/converter': Converter,
        '(tabs)/rates': Rates,
        '(tabs)/history': History,
        '(tabs)/settings': Settings,
      },
      { initialUrl: '/converter' },
    );

    await screen.findByRole('tab', { name: 'Início' });
    for (const label of ['Converter', 'Cotações', 'Histórico', 'Ajustes']) {
      expect(screen.getByRole('tab', { name: label })).toBeTruthy();
    }

    await act(async () => {
      fireEvent.press(screen.getByRole('tab', { name: 'Cotações' }));
    });

    await waitFor(() => expect(router.getPathname()).toBe('/rates'));
    expect(screen.getByRole('tab', { name: 'Cotações' })).toBeSelected();
  });
});
