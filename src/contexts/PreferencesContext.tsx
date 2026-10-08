import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { SUPPORTED_CURRENCIES } from '@constants/currencies.constants';
import { STORAGE_KEYS } from '@constants/storage';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';

const DEFAULT_PRIMARY_CURRENCY: CurrencyCodeValue = 'BRL';
const DEFAULT_FAVORITE_CURRENCIES: CurrencyCodeValue[] = ['EUR', 'GBP', 'ARS', 'JPY'];

type PreferencesContextValue = {
  ready: boolean;
  primaryCurrency: CurrencyCodeValue;
  favoriteCurrencies: CurrencyCodeValue[];
  setPrimaryCurrency: (currency: CurrencyCodeValue) => Promise<void>;
  setFavoriteCurrencies: (currencies: CurrencyCodeValue[]) => Promise<void>;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

/** Propriedades do provider de preferências. */
type PreferencesProviderProps = {
  /** Árvore que recebe as preferências carregadas. */
  children: ReactNode;
};

function isCurrencyCode(value: unknown): value is CurrencyCodeValue {
  return typeof value === 'string' && SUPPORTED_CURRENCIES.some((code) => code === value);
}

function parseFavoriteCurrencies(value: string | null): CurrencyCodeValue[] | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed) || !parsed.every(isCurrencyCode)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Persists the user's primary and favorite currencies for Home and Settings.
 *
 * @example
 * ```tsx
 * <PreferencesProvider><Stack /></PreferencesProvider>
 * ```
 */
export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [primaryCurrency, setPrimaryCurrencyState] = useState(DEFAULT_PRIMARY_CURRENCY);
  const [favoriteCurrencies, setFavoriteCurrenciesState] = useState(DEFAULT_FAVORITE_CURRENCIES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.primaryCurrency),
      AsyncStorage.getItem(STORAGE_KEYS.favoriteCurrencies),
    ])
      .then(([savedPrimary, savedFavorites]) => {
        if (!mounted) return;
        if (isCurrencyCode(savedPrimary)) setPrimaryCurrencyState(savedPrimary);
        const favorites = parseFavoriteCurrencies(savedFavorites);
        if (favorites) setFavoriteCurrenciesState(favorites);
        setReady(true);
      })
      .catch(() => {
        if (mounted) setReady(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const setPrimaryCurrency = useCallback(async (currency: CurrencyCodeValue) => {
    setPrimaryCurrencyState(currency);
    await AsyncStorage.setItem(STORAGE_KEYS.primaryCurrency, currency).catch(() => undefined);
  }, []);

  const setFavoriteCurrencies = useCallback(async (currencies: CurrencyCodeValue[]) => {
    const uniqueCurrencies = [...new Set(currencies)];
    setFavoriteCurrenciesState(uniqueCurrencies);
    await AsyncStorage.setItem(
      STORAGE_KEYS.favoriteCurrencies,
      JSON.stringify(uniqueCurrencies),
    ).catch(() => undefined);
  }, []);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      ready,
      primaryCurrency,
      favoriteCurrencies,
      setPrimaryCurrency,
      setFavoriteCurrencies,
    }),
    [favoriteCurrencies, primaryCurrency, ready, setFavoriteCurrencies, setPrimaryCurrency],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

/** Reads the user's persisted primary and favorite currencies. */
export function usePreferences() {
  const preferences = useContext(PreferencesContext);
  if (!preferences) throw new Error('usePreferences precisa estar dentro do PreferencesProvider');
  return preferences;
}
