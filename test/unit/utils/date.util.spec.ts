import { utcDateAtOffset } from '@utils/date.util';

describe('utcDateAtOffset', () => {
  it('returns the reference date as a UTC date-only string', () => {
    expect(utcDateAtOffset(0, new Date('2026-10-01T00:30:00-03:00'))).toBe('2026-10-01');
  });

  it('applies the offset in UTC calendar days', () => {
    expect(utcDateAtOffset(-1, new Date('2026-10-01T01:00:00Z'))).toBe('2026-09-30');
  });
});
