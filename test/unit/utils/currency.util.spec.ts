import { CurrencyCode } from '@enums/currency-code.enum';
import { CURRENCY_SYMBOLS, getCurrencySymbol, isCurrencyCode } from '@utils/currency.util';

describe('currency util', () => {
  it('has a symbol for each of the 10 currencies', () => {
    expect(Object.keys(CURRENCY_SYMBOLS)).toEqual(Object.values(CurrencyCode));
  });

  it.each([
    ['USD', 'US$'],
    ['BRL', 'R$'],
    ['EUR', '€'],
    ['GBP', '£'],
    ['JPY', '¥'],
    ['CAD', 'C$'],
    ['AUD', 'A$'],
    ['CHF', 'Fr'],
    ['CNY', '元'],
    ['ARS', 'AR$'],
  ])('shows %s as %s', (code, symbol) => {
    expect(getCurrencySymbol(code)).toBe(symbol);
  });

  it('falls back to the code for an unknown currency', () => {
    expect(isCurrencyCode('XYZ')).toBe(false);
    expect(getCurrencySymbol('XYZ')).toBe('XYZ');
  });
});
