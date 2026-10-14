import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { STORAGE_KEYS } from '@constants/storage';
import { type Colors, darkColors, lightColors } from '@constants/theme';

export type ThemeScheme = 'system' | 'light' | 'dark';

const SCHEMES: readonly ThemeScheme[] = ['system', 'light', 'dark'];

type ThemeContextValue = {
  dark: boolean;

  colors: Colors;

  scheme: ThemeScheme;

  ready: boolean;

  setScheme: (scheme: ThemeScheme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
};

/**
 * [EN] Provides the active theme palette and persists the user preference.
 * [PT-BR] Disponibiliza a paleta ativa e persiste a preferência do usuário.
 *
 * @example
 * ```tsx
 * <ThemeProvider><Stack /></ThemeProvider>
 * ```
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [scheme, setSchemeState] = useState<ThemeScheme>('system');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(STORAGE_KEYS.theme)
      .then((saved) => {
        if (mounted && SCHEMES.includes(saved as ThemeScheme)) {
          setSchemeState(saved as ThemeScheme);
        }
        if (mounted) setReady(true);
      })
      .catch(() => {
        if (mounted) setReady(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const dark = scheme === 'system' ? systemScheme === 'dark' : scheme === 'dark';

    return {
      dark,
      colors: dark ? darkColors : lightColors,
      scheme,
      ready,
      setScheme: (next) => {
        setSchemeState(next);
        AsyncStorage.setItem(STORAGE_KEYS.theme, next).catch(() => undefined);
      },
    };
  }, [ready, scheme, systemScheme]);

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar style={value.dark ? 'light' : 'dark'} />
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * [EN] Returns the active color palette and theme controls.
 * [PT-BR] Retorna a paleta de cores ativa e os controles do tema.
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme precisa estar dentro do ThemeProvider');
  }

  return context;
}
