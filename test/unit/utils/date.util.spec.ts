import { getRelativeDay, utcDateAtOffset } from '@utils/date.util';

describe('utcDateAtOffset', () => {
  it('returns the reference date as a UTC date-only string', () => {
    expect(utcDateAtOffset(0, new Date('2026-10-01T00:30:00-03:00'))).toBe('2026-10-01');
  });

  it('applies the offset in UTC calendar days', () => {
    expect(utcDateAtOffset(-1, new Date('2026-10-01T01:00:00Z'))).toBe('2026-09-30');
  });
});

describe('getRelativeDay', () => {
  const now = new Date('2026-10-14T15:00:00-03:00');

  it('returns today for a time on the same local day', () => {
    expect(getRelativeDay('2026-10-14T09:00:02Z', now)).toBe('today');
  });

  it('returns yesterday for a time on the previous local day', () => {
    expect(getRelativeDay('2026-10-13T09:00:02Z', now)).toBe('yesterday');
  });

  it('returns other for older times', () => {
    expect(getRelativeDay('2026-10-12T09:00:02Z', now)).toBe('other');
  });

  it('uses the local day instead of the UTC day near midnight', () => {
    expect(getRelativeDay('2026-10-15T01:30:00Z', now)).toBe('today');
  });
});
