import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ReactNative from 'react-native';

import { act, renderHook, waitFor } from '@testing-library/react-native';

import { STORAGE_KEYS } from '@constants/storage';
import { darkColors, lightColors } from '@constants/theme';
import { ThemeProvider, useTheme } from '@theme/ThemeProvider';

function mockSystemScheme(scheme: 'light' | 'dark') {
  jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue(scheme);
}

function renderTheme() {
  return renderHook(() => useTheme(), { wrapper: ThemeProvider });
}

describe('ThemeProvider', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('follows the phone when nothing is saved', async () => {
    mockSystemScheme('dark');
    const { result } = renderTheme();

    expect(result.current).toMatchObject({ scheme: 'system', dark: true, colors: darkColors });
    await waitFor(() => expect(result.current.ready).toBe(true));
  });

  it('uses the light palette when the phone is light', async () => {
    mockSystemScheme('light');
    const { result } = renderTheme();

    expect(result.current).toMatchObject({ dark: false, colors: lightColors });
    await waitFor(() => expect(result.current.ready).toBe(true));
  });

  it('uses the saved choice over the phone', async () => {
    mockSystemScheme('light');
    await AsyncStorage.setItem(STORAGE_KEYS.theme, 'dark');
    const { result } = renderTheme();

    await waitFor(() => expect(result.current.scheme).toBe('dark'));
    expect(result.current.ready).toBe(true);
    expect(result.current.colors).toBe(darkColors);
  });

  it('follows system theme changes when scheme is system', async () => {
    let systemScheme: 'light' | 'dark' = 'light';
    jest.spyOn(ReactNative, 'useColorScheme').mockImplementation(() => systemScheme);
    const { result, rerender } = renderTheme();

    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.dark).toBe(false);

    systemScheme = 'dark';
    rerender(undefined);

    expect(result.current.dark).toBe(true);
  });

  it('restores the saved light choice over a dark phone setting', async () => {
    mockSystemScheme('dark');
    await AsyncStorage.setItem(STORAGE_KEYS.theme, 'light');
    const { result } = renderTheme();

    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current).toMatchObject({ scheme: 'light', dark: false, colors: lightColors });
  });

  it('ignores an invalid saved value', async () => {
    mockSystemScheme('light');
    await AsyncStorage.setItem(STORAGE_KEYS.theme, 'purple');
    const { result } = renderTheme();

    await act(async () => {});

    expect(result.current.scheme).toBe('system');
  });

  it('switches the theme and saves the choice', async () => {
    mockSystemScheme('light');
    const { result } = renderTheme();
    await waitFor(() => expect(result.current.ready).toBe(true));

    await act(async () => {
      result.current.setScheme('dark');
    });

    expect(result.current).toMatchObject({ scheme: 'dark', dark: true });
    expect(await AsyncStorage.getItem(STORAGE_KEYS.theme)).toBe('dark');
  });

  it('throws when used outside the provider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme precisa estar dentro do ThemeProvider',
    );
  });
});
