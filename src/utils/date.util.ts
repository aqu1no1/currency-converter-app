import { TIME_IN_MS } from '@constants/time.constants';

export function utcDateAtOffset(days: number, referenceDate = new Date()) {
  return new Date(referenceDate.getTime() + days * TIME_IN_MS.DAY).toISOString().slice(0, 10);
}

export type RelativeDay = 'today' | 'yesterday' | 'other';

function isSameLocalDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getRelativeDay(value: Date | string | number, now: Date = new Date()): RelativeDay {
  const date = value instanceof Date ? value : new Date(value);
  if (isSameLocalDay(date, now)) return 'today';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return isSameLocalDay(date, yesterday) ? 'yesterday' : 'other';
}
