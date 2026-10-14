import Decimal from 'decimal.js';

import {
  applyKeypadKey,
  convertAmount,
  currencyFractionDigits,
  toInputAmount,
} from '@utils/converter.util';

describe('applyKeypadKey', () => {
  it('replaces the initial zero with the first digit', () => {
    expect(applyKeypadKey('0', '7')).toBe('7');
    expect(applyKeypadKey('0', '00')).toBe('0');
  });

  it('appends digits and double zeros', () => {
    expect(applyKeypadKey('12', '3')).toBe('123');
    expect(applyKeypadKey('12', '00')).toBe('1200');
  });

  it('accepts a single decimal separator and at most two decimals', () => {
    expect(applyKeypadKey('12', 'decimal')).toBe('12.');
    expect(applyKeypadKey('12.', 'decimal')).toBe('12.');
    expect(applyKeypadKey('12.5', '0')).toBe('12.50');
    expect(applyKeypadKey('12.50', '1')).toBe('12.50');
    expect(applyKeypadKey('12.5', '00')).toBe('12.5');
  });

  it('limits the amount to ten digits', () => {
    expect(applyKeypadKey('1234567890', '1')).toBe('1234567890');
    expect(applyKeypadKey('123456789', '00')).toBe('123456789');
    expect(applyKeypadKey('9999999950', 'add100')).toBe('9999999950');
  });

  it('deletes the last character and falls back to zero', () => {
    expect(applyKeypadKey('123', 'delete')).toBe('12');
    expect(applyKeypadKey('7', 'delete')).toBe('0');
  });

  it('clears the amount', () => {
    expect(applyKeypadKey('123.45', 'clear')).toBe('0');
  });

  it('adds 100 and 1000 keeping decimals', () => {
    expect(applyKeypadKey('12.5', 'add100')).toBe('112.5');
    expect(applyKeypadKey('0', 'add1000')).toBe('1000');
    expect(applyKeypadKey('12.', 'add100')).toBe('112');
  });
});

describe('convertAmount', () => {
  it('multiplies with decimal precision and rounds at the end', () => {
    expect(convertAmount('100', 0.169741, 'EUR').toFixed()).toBe('16.97');
    expect(convertAmount('0.1', 0.2, 'USD').toFixed()).toBe('0.02');
  });

  it('rounds currencies without minor units to integers', () => {
    expect(currencyFractionDigits('JPY')).toBe(0);
    expect(convertAmount('100', 30.32, 'JPY').toFixed()).toBe('3032');
    expect(convertAmount('1', 30.5, 'JPY').toFixed()).toBe('31');
  });

  it('treats a trailing decimal separator as an integer amount', () => {
    expect(convertAmount('10.', 2, 'USD').toFixed()).toBe('20');
  });
});

describe('toInputAmount', () => {
  it('keeps cents and drops empty decimals', () => {
    expect(toInputAmount(new Decimal('16.97'), 'EUR')).toBe('16.97');
    expect(toInputAmount(new Decimal('20'), 'USD')).toBe('20');
    expect(toInputAmount(new Decimal('3032'), 'JPY')).toBe('3032');
  });
});
