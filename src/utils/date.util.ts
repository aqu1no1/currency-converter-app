import { TIME_IN_MS } from '@constants/time.constants';

/** Returns a UTC YYYY-MM-DD date offset from a reference day. */
export function utcDateAtOffset(days: number, referenceDate = new Date()) {
  return new Date(referenceDate.getTime() + days * TIME_IN_MS.DAY).toISOString().slice(0, 10);
}
