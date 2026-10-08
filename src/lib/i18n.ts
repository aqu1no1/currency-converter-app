import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { STORAGE_KEYS } from '@constants/storage';
import { en } from '@locales/en';
import { es } from '@locales/es';
import { ptBR } from '@locales/pt-BR';

export const LANGUAGES = ['pt-BR', 'en', 'es'] as const;

export type Language = (typeof LANGUAGES)[number];

export function resolveLanguage(languageCode?: string | null): Language {
  if (languageCode === 'en') return 'en';
  if (languageCode === 'es') return 'es';
  return 'pt-BR';
}

export function detectLanguage(): Language {
  return resolveLanguage(getLocales()[0]?.languageCode);
}

const initialization = i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: ptBR },
    en: { translation: en },
    es: { translation: es },
  },
  lng: detectLanguage(),
  fallbackLng: 'pt-BR',
  supportedLngs: LANGUAGES,
  initAsync: false,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export const i18nReady = initialization.then(async () => {
  const savedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.language).catch(() => null);

  if (LANGUAGES.includes(savedLanguage as Language)) {
    await i18n.changeLanguage(savedLanguage as Language);
  }
});

void i18nReady;

export async function setLanguage(language: Language) {
  await i18nReady;
  await i18n.changeLanguage(language);
  await AsyncStorage.setItem(STORAGE_KEYS.language, language);
}

export { i18n };
