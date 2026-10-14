import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, waitFor } from '@testing-library/react-native';

import { STORAGE_KEYS } from '@constants/storage';
import { renderHookWithProviders } from '@test/utils/render-with-providers';
import { usePreferences } from '@contexts/PreferencesContext';

describe('PreferencesContext', () => {
  it('loads BRL and the default favorites when nothing was saved', async () => {
    const { result } = await renderHookWithProviders(() => usePreferences());

    expect(result.current.ready).toBe(true);
    expect(result.current.primaryCurrency).toBe('BRL');
    expect(result.current.favoriteCurrencies).toEqual(['EUR', 'GBP', 'ARS', 'JPY']);
  });

  it('restores the saved currency and favorites', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.primaryCurrency, 'EUR');
    await AsyncStorage.setItem(STORAGE_KEYS.favoriteCurrencies, JSON.stringify(['USD', 'JPY']));

    const { result } = await renderHookWithProviders(() => usePreferences());

    await waitFor(() => expect(result.current.primaryCurrency).toBe('EUR'));
    expect(result.current.favoriteCurrencies).toEqual(['USD', 'JPY']);
  });

  it('persists preference changes', async () => {
    const { result } = await renderHookWithProviders(() => usePreferences());

    await act(async () => {
      await result.current.setPrimaryCurrency('CAD');
      await result.current.setFavoriteCurrencies(['USD', 'EUR']);
    });

    expect(await AsyncStorage.getItem(STORAGE_KEYS.primaryCurrency)).toBe('CAD');
    expect(await AsyncStorage.getItem(STORAGE_KEYS.favoriteCurrencies)).toBe(
      JSON.stringify(['USD', 'EUR']),
    );
  });
});
