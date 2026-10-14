import { CurrencyCode, type CurrencyCodeValue } from '@enums/currency-code.enum';

export const SUPPORTED_CURRENCIES: readonly CurrencyCode[] = Object.values(CurrencyCode);

export const DISPLAY_CURRENCY_ORDER: readonly CurrencyCodeValue[] = [
  'USD',
  'EUR',
  'BRL',
  'GBP',
  'JPY',
  'CAD',
  'AUD',
  'CHF',
  'CNY',
  'ARS',
];
