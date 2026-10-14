import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { type ReactNode, useEffect, useMemo } from 'react';

import { usePreferences } from '@contexts/PreferencesContext';
import { useTheme } from '@theme/ThemeProvider';

interface RootNavigatorProps {
  /** Se as fontes do app já foram carregadas (ou falharam ao carregar). */
  fontsReady: boolean;
  /** Se o idioma salvo já foi aplicado ao i18n. */
  localeReady: boolean;
  /** Navegação do app, normalmente o `Stack` do layout raiz. */
  children: ReactNode;
}

/**
 * Libera a navegação do app quando tudo o que a primeira tela precisa já carregou.
 *
 * Espera fontes, idioma, tema e preferências ficarem prontos e só então esconde
 * a splash e renderiza a navegação. Também aplica o fundo do tema às telas da
 * navegação, para que nenhuma área clara apareça em volta da barra de abas.
 *
 * @example
 * ```tsx
 * <RootNavigator fontsReady={fontsReady} localeReady={localeReady}>
 *   <Stack>
 *     <Stack.Screen name="index" options={{ headerShown: false }} />
 *   </Stack>
 * </RootNavigator>
 * ```
 */
export function RootNavigator({ fontsReady, localeReady, children }: RootNavigatorProps) {
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

  return <NavigationThemeProvider value={navigationTheme}>{children}</NavigationThemeProvider>;
}
