import { i18n, type Language } from '@lib/i18n';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';

function currentLanguage(): Language {
  const language = i18n.resolvedLanguage;
  return language && ['pt-BR', 'en', 'es'].includes(language) ? (language as Language) : 'pt-BR';
}

export function formatMoney(
  amount: number,
  currency: CurrencyCodeValue,
  language = currentLanguage(),
) {
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency,
  })
    .format(amount)
    .replace(/[\u00a0\u202f]/g, ' ');
}

export function formatDate(
  value: Date | string | number,
  language = currentLanguage(),
  options: Intl.DateTimeFormatOptions = {},
) {
  return new Intl.DateTimeFormat(language, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options,
    timeZone: 'UTC',
  }).format(value instanceof Date ? value : new Date(value));
}
