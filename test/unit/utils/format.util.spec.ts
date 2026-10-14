import {
  formatAmountInput,
  formatConversionRate,
  formatDate,
  formatMoney,
  formatRateMoney,
  formatShortDate,
  formatTime,
  getDecimalSeparator,
} from '@utils/format.util';

describe('format util', () => {
  it('formats money in Brazilian Portuguese', () => {
    expect(formatMoney(1234.5, 'BRL', 'pt-BR')).toBe('R$ 1.234,50');
  });

  it('formats money in English', () => {
    expect(formatMoney(1234.5, 'BRL', 'en')).toBe('R$1,234.50');
  });

  it('keeps precision for small converted currency rates', () => {
    expect(formatRateMoney(0.0034, 'BRL', 'pt-BR')).toBe('R$ 0,0034');
    expect(formatRateMoney(5.89, 'BRL', 'pt-BR')).toBe('R$ 5,89');
  });

  it('formats rate dates in UTC', () => {
    const timestamp = '2025-12-31T23:30:00-03:00';

    expect(formatDate(timestamp, 'pt-BR')).toBe('01/01/2026');
    expect(formatDate(timestamp, 'en')).toBe('01/01/2026');
  });

  it('formats sync times in the device time zone', () => {
    expect(formatTime('2026-09-29T09:00:02Z', 'pt-BR')).toBe('06:00');
  });

  it('formats short dates in the device time zone', () => {
    expect(formatShortDate('2026-09-30T01:30:00Z', 'pt-BR')).toBe('29/09');
  });

  it('formats the typed amount with locale grouping and separator', () => {
    expect(formatAmountInput('1234567.5', 'pt-BR')).toBe('1.234.567,5');
    expect(formatAmountInput('1234.', 'pt-BR')).toBe('1.234,');
    expect(formatAmountInput('1234.05', 'en')).toBe('1,234.05');
    expect(getDecimalSeparator('es')).toBe(',');
  });

  it('formats conversion rates with 2, 4 or 6 decimals', () => {
    expect(formatConversionRate(293.275, 'pt-BR')).toBe('293,28');
    expect(formatConversionRate(0.169741, 'pt-BR')).toBe('0,1697');
    expect(formatConversionRate(0.003409, 'pt-BR')).toBe('0,003409');
  });
});
