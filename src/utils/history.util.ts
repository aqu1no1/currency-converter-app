import type { HistoryPoint } from '@components/charts/HistoryChart';
import { TIME_IN_MS } from '@constants/time.constants';
import { utcDateAtOffset } from '@utils/date.util';
import { formatDate } from '@utils/format.util';

const FALLBACK_STEP_DAYS = TIME_IN_MS.MONTH / TIME_IN_MS.DAY;

export function buildFallbackHistory(rates: readonly number[]): HistoryPoint[] {
  return rates.map((value, index) => {
    const date = utcDateAtOffset(-(rates.length - index - 1) * FALLBACK_STEP_DAYS);
    return { value, label: formatDate(date), date };
  });
}

export function sampleHistory(
  history: readonly { date: string; rate: number }[],
  maxPoints: number,
): HistoryPoint[] {
  const interval = Math.max(1, Math.floor(history.length / (maxPoints - 1)));
  const sampled =
    history.length <= maxPoints
      ? history
      : history.filter((_, index) => index % interval === 0 || index === history.length - 1);

  return sampled.map(({ date, rate }) => ({ value: rate, label: formatDate(date), date }));
}

export type HistoryPeriod = 'week' | 'month' | 'year';

export const HISTORY_PERIOD_DAYS: Record<HistoryPeriod, number> = {
  week: TIME_IN_MS.WEEK / TIME_IN_MS.DAY,
  month: TIME_IN_MS.MONTH / TIME_IN_MS.DAY,
  year: TIME_IN_MS.YEAR / TIME_IN_MS.DAY,
};

export function historyRange(period: HistoryPeriod, referenceDate = new Date()) {
  return {
    start: utcDateAtOffset(-HISTORY_PERIOD_DAYS[period], referenceDate),
    end: utcDateAtOffset(0, referenceDate),
  };
}

export type HistorySummaryPoint = { date: string; rate: number };

export type HistorySummary = {
  first: HistorySummaryPoint;
  last: HistorySummaryPoint;
  min: HistorySummaryPoint;
  max: HistorySummaryPoint;
  change: number;
};

export function summarizeHistory(
  history: readonly HistorySummaryPoint[],
): HistorySummary | undefined {
  const first = history[0];
  const last = history.at(-1);
  if (!first || !last) return undefined;

  const min = history.reduce((lowest, point) => (point.rate < lowest.rate ? point : lowest));
  const max = history.reduce((highest, point) => (point.rate > highest.rate ? point : highest));

  return { first, last, min, max, change: (last.rate / first.rate - 1) * 100 };
}
