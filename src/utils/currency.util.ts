import { CurrencyCode } from '@enums/currency-code.enum';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  [CurrencyCode.USD]: 'US$',
  [CurrencyCode.BRL]: 'R$',
  [CurrencyCode.EUR]: '€',
  [CurrencyCode.GBP]: '£',
  [CurrencyCode.JPY]: '¥',
  [CurrencyCode.CAD]: 'C$',
  [CurrencyCode.AUD]: 'A$',
  [CurrencyCode.CHF]: 'Fr',
  [CurrencyCode.CNY]: '元',
  [CurrencyCode.ARS]: 'AR$',
};

export function isCurrencyCode(value: string): value is CurrencyCode {
  return value in CURRENCY_SYMBOLS;
}

export function getCurrencySymbol(code: string): string {
  return isCurrencyCode(code) ? CURRENCY_SYMBOLS[code] : code;
}
