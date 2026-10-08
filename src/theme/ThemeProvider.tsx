import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { STORAGE_KEYS } from '@constants/storage';
import { type Colors, darkColors, lightColors } from '@constants/theme';

export type ThemeScheme = 'system' | 'light' | 'dark';

const SCHEMES: readonly ThemeScheme[] = ['system', 'light', 'dark'];

/** Valor exposto pelo `useTheme()`. */
type ThemeContextValue = {
  /** `true` quando o tema ativo é o escuro. */
  dark: boolean;
  /** Paleta do tema ativo, com tokens semânticos (`textPrimary`, `surfacePrimary`...). */
  colors: Colors;
  /** Escolha do usuário: `system` segue o celular. @default 'system' */
  scheme: ThemeScheme;
  /** `true` quando a preferência persistida já foi carregada. */
  ready: boolean;
  /** Troca o tema e salva a escolha no AsyncStorage. */
  setScheme: (scheme: ThemeScheme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Props do componente ThemeProvider. */
type ThemeProviderProps = {
  /** Árvore que passa a enxergar o tema. */
  children: ReactNode;
};

/**
 * Provider do tema claro e escuro. Começa seguindo o celular e, se houver uma
 * escolha salva, passa a usar ela. Fica no topo do `_layout.tsx`.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <Stack />
 * </ThemeProvider>
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

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme precisa estar dentro do ThemeProvider');
  }

  return context;
}
