import {
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
} from '@expo-google-fonts/instrument-sans';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider as NavigationThemeProvider,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ApiProvider } from '@contexts/ApiProvider';
import { PreferencesProvider, usePreferences } from '@contexts/PreferencesContext';
import { i18nReady } from '@lib/i18n';
import { queryClient } from '@lib/query-client';
import { ThemeProvider, useTheme } from '@theme/ThemeProvider';

void SplashScreen.preventAutoHideAsync();
/**
 * [EN] Loads app fonts, providers, and the root navigation stack.
 * [PT-BR] Carrega as fontes, os provedores e a navegação principal do app.
 *
 * @example
 * ```tsx
 * <RootLayout {...exampleProps} />
 * ```
 */

const RootLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    ...MaterialCommunityIcons.font,
    ...MaterialIcons.font,
  });

  const fontsReady = fontsLoaded || fontError !== null;
  const [localeReady, setLocaleReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    void i18nReady.then(
      () => mounted && setLocaleReady(true),
      () => mounted && setLocaleReady(true),
    );

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ApiProvider>
            <PreferencesProvider>
              <RootNavigator fontsReady={fontsReady} localeReady={localeReady} />
            </PreferencesProvider>
          </ApiProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
/**
 * [EN] Selects the initial route after app and locale resources are ready.
 * [PT-BR] Seleciona a rota inicial após carregar os recursos do app e do idioma.
 *
 * @example
 * ```tsx
 * <RootNavigator {...exampleProps} />
 * ```
 */

const RootNavigator = ({
  fontsReady,
  localeReady,
}: {
  fontsReady: boolean;
  localeReady: boolean;
}) => {
  const { ready: themeReady, dark, colors } = useTheme();
  const { ready: preferencesReady } = usePreferences();
  const ready = fontsReady && localeReady && themeReady && preferencesReady;

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  const navigationTheme = useMemo(() => {
    const base = dark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: { ...base.colors, background: colors.background, card: colors.background },
    };
  }, [colors.background, dark]);

  if (!ready) return null;

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </NavigationThemeProvider>
  );
};
