import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@constants/storage';
import { i18n, i18nReady, resolveLanguage, setLanguage } from '@lib/i18n';

describe('i18n language preference', () => {
  it('changes and persists the selected language', async () => {
    await i18nReady;

    await setLanguage('en');

    expect(i18n.resolvedLanguage).toBe('en');
    expect(await AsyncStorage.getItem(STORAGE_KEYS.language)).toBe('en');

    await setLanguage('pt-BR');
  });

  it.each([
    ['en', 'en'],
    ['es', 'es'],
    ['pt', 'pt-BR'],
    ['fr', 'pt-BR'],
    [undefined, 'pt-BR'],
  ] as const)('resolves %s to %s', (languageCode, expected) => {
    expect(resolveLanguage(languageCode)).toBe(expected);
  });
});
