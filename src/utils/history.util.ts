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
