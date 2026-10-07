import { TIME_IN_MINUTES, TIME_IN_MS, TIME_IN_SECONDS } from '@constants/time.constants';

describe('time constants', () => {
  it('keeps the units consistent with each other', () => {
    expect(TIME_IN_MS.MINUTE).toBe(60 * TIME_IN_MS.SECOND);
    expect(TIME_IN_MS.DAY).toBe(TIME_IN_SECONDS.DAY * TIME_IN_MS.SECOND);
    expect(TIME_IN_MINUTES.HOUR).toBe(60);
  });
});
