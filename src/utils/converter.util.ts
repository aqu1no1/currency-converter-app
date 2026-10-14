import Decimal from 'decimal.js';

import type { CurrencyCodeValue } from '@enums/currency-code.enum';

export type DigitKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type KeypadKey = DigitKey | '00' | 'decimal' | 'delete' | 'clear' | 'add100' | 'add1000';

export const INITIAL_AMOUNT = '100';

const MAX_AMOUNT_DIGITS = 10;
const MAX_FRACTION_DIGITS = 2;
const ADDITIONS: Partial<Record<KeypadKey, number>> = { add100: 100, add1000: 1000 };

function countDigits(amount: string) {
  return amount.replace('.', '').length;
}

function fractionLength(amount: string) {
  const [, fraction] = amount.split('.');
  return fraction?.length ?? 0;
}

export function toDecimal(amount: string) {
  const normalized = amount.endsWith('.') ? amount.slice(0, -1) : amount;
  return new Decimal(normalized || '0');
}

export function applyKeypadKey(amount: string, key: KeypadKey): string {
  if (key === 'clear') return '0';
  if (key === 'delete') return amount.length > 1 ? amount.slice(0, -1) : '0';
  if (key === 'decimal') return amount.includes('.') ? amount : `${amount}.`;

  const addition = ADDITIONS[key];
  if (addition !== undefined) {
    const next = toDecimal(amount).plus(addition).toFixed();
    return countDigits(next) > MAX_AMOUNT_DIGITS ? amount : next;
  }

  const digits = key === '00' ? '00' : key;
  if (amount === '0') return key === '00' ? amount : digits;
  if (countDigits(amount) + digits.length > MAX_AMOUNT_DIGITS) return amount;
  if (amount.includes('.') && fractionLength(amount) + digits.length > MAX_FRACTION_DIGITS) {
    return amount;
  }
  return `${amount}${digits}`;
}

export function currencyFractionDigits(currency: CurrencyCodeValue) {
  return (
    new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions()
      .maximumFractionDigits ?? 2
  );
}

export function convertAmount(amount: string, rate: number, currency: CurrencyCodeValue) {
  return toDecimal(amount)
    .times(rate)
    .toDecimalPlaces(currencyFractionDigits(currency), Decimal.ROUND_HALF_UP);
}

export function toInputAmount(value: Decimal, currency: CurrencyCodeValue) {
  return value
    .toFixed(currencyFractionDigits(currency), Decimal.ROUND_HALF_UP)
    .replace(/\.0+$/, '');
}
