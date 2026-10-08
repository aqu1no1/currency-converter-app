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

export function formatRateMoney(
  amount: number,
  currency: CurrencyCodeValue,
  language = currentLanguage(),
) {
  const defaultDigits =
    new Intl.NumberFormat(language, {
      style: 'currency',
      currency,
    }).resolvedOptions().maximumFractionDigits ?? 2;
  const digits = Math.abs(amount) < 0.1 ? Math.max(defaultDigits, 4) : defaultDigits;

  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
    .format(amount)
    .replace(/[\u00a0\u202f]/g, ' ');
}

export function formatRate(value: number, language = currentLanguage()) {
  return new Intl.NumberFormat(language, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);
}

export function formatTime(value: Date | string | number, language = currentLanguage()) {
  return new Intl.DateTimeFormat(language, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(value instanceof Date ? value : new Date(value));
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
