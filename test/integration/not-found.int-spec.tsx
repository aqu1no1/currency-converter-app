import { Stack } from 'expo-router';
import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import NotFoundScreen from '@app/+not-found';
import { ThemeProvider } from '@theme/ThemeProvider';

function Layout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

describe('Not found route', () => {
  it('shows the not found screen for an unknown deep link and goes home', async () => {
    const router = renderRouter(
      { _layout: Layout, home: () => <Text>Início</Text>, '+not-found': NotFoundScreen },
      { initialUrl: '/rota-inexistente' },
    );
    await act(async () => {});

    expect(await screen.findByText('Tela não encontrada')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Ir para o início' }));

    expect(await screen.findByText('Início')).toBeTruthy();
    expect(router.getPathname()).toBe('/home');
  });
});
