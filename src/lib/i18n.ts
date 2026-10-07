import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from '@locales/en';
import { es } from '@locales/es';
import { ptBR } from '@locales/pt-BR';

export const LANGUAGES = ['pt-BR', 'en', 'es'] as const;

export type Language = (typeof LANGUAGES)[number];

export function detectLanguage(): Language {
  const [locale] = getLocales();

  if (locale?.languageCode === 'en') return 'en';
  if (locale?.languageCode === 'es') return 'es';
  return 'pt-BR';
}

void i18n.use(initReactI18next).init({
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

export { i18n };
