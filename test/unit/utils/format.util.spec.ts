import { formatDate, formatMoney, formatRateMoney } from '@utils/format.util';

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
});
