import {
  buildFallbackHistory,
  historyRange,
  sampleHistory,
  summarizeHistory,
} from '@utils/history.util';

describe('buildFallbackHistory', () => {
  it('spaces the rates one month apart ending today', () => {
    jest.useFakeTimers({ now: new Date('2026-10-14T12:00:00Z') });

    const history = buildFallbackHistory([5.1, 5.2, 5.3]);

    expect(history.map(({ value }) => value)).toEqual([5.1, 5.2, 5.3]);
    expect(history.map(({ date }) => date)).toEqual(['2026-08-15', '2026-09-14', '2026-10-14']);
    expect(history[2]?.label).toBe('14/10/2026');

    jest.useRealTimers();
  });
});

describe('sampleHistory', () => {
  const daily = Array.from({ length: 250 }, (_, index) => ({
    date: `2026-01-${String((index % 28) + 1).padStart(2, '0')}`,
    rate: 5 + index / 1000,
  }));

  it('keeps short histories untouched', () => {
    expect(sampleHistory(daily.slice(0, 10), 52)).toHaveLength(10);
  });

  it('samples long histories and always keeps the latest rate', () => {
    const sampled = sampleHistory(daily, 52);

    expect(sampled).toHaveLength(64);
    expect(sampled[0]?.value).toBe(daily[0]?.rate);
    expect(sampled.at(-1)?.value).toBe(daily.at(-1)?.rate);
  });
});

describe('historyRange', () => {
  const reference = new Date('2026-09-28T23:30:00-03:00');

  it.each([
    ['week', '2026-09-22'],
    ['month', '2026-08-30'],
    ['year', '2025-09-29'],
  ] as const)('starts the %s period the right number of days before', (period, start) => {
    expect(historyRange(period, reference)).toEqual({ start, end: '2026-09-29' });
  });
});

describe('summarizeHistory', () => {
  it('returns the first, last, lowest and highest rates with their dates', () => {
    const summary = summarizeHistory([
      { date: '2026-09-01', rate: 5.4 },
      { date: '2026-09-10', rate: 5.3 },
      { date: '2026-09-15', rate: 5.3 },
      { date: '2026-09-20', rate: 5.5 },
      { date: '2026-09-28', rate: 5.35 },
    ]);

    expect(summary?.first).toEqual({ date: '2026-09-01', rate: 5.4 });
    expect(summary?.last).toEqual({ date: '2026-09-28', rate: 5.35 });
    expect(summary?.min).toEqual({ date: '2026-09-10', rate: 5.3 });
    expect(summary?.max).toEqual({ date: '2026-09-20', rate: 5.5 });
    expect(summary?.change).toBeCloseTo(-0.926, 3);
  });

  it('returns undefined for an empty period', () => {
    expect(summarizeHistory([])).toBeUndefined();
  });
});
