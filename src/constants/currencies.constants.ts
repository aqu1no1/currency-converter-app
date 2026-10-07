export const SUPPORTED_CURRENCIES = [
  'USD',
  'BRL',
  'EUR',
  'GBP',
  'JPY',
  'CAD',
  'AUD',
  'CHF',
  'CNY',
  'ARS',
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];
