import { describeRunResult, formatRunDuration, getRunDurationSeconds } from '@utils/sync.util';

const RUN = {
  status: 'SUCCESS' as const,
  startedAt: '2026-09-28T09:00:00.000Z',
  finishedAt: '2026-09-28T09:00:02.000Z',
  rowsInserted: 45,
};

describe('sync util', () => {
  it('measures the run duration in seconds', () => {
    expect(getRunDurationSeconds(RUN)).toBe(2);
    expect(getRunDurationSeconds({ ...RUN, finishedAt: null })).toBeNull();
  });

  it('formats short and long durations', () => {
    expect(formatRunDuration(2)).toBe('2 s');
    expect(formatRunDuration(150)).toBe('3 min');
  });

  it('describes the result of each run status', () => {
    expect(describeRunResult(RUN)).toBe('45 linhas em 2 s');
    expect(describeRunResult({ ...RUN, rowsInserted: 1 })).toBe('1 linha em 2 s');
    expect(describeRunResult({ ...RUN, rowsInserted: 88400, finishedAt: null })).toBe(
      '88.400 linhas',
    );
    expect(describeRunResult({ ...RUN, status: 'FAILED', errorMessage: 'timeout' })).toBe(
      'timeout',
    );
    expect(describeRunResult({ ...RUN, status: 'FAILED' })).toBe('falhou');
    expect(describeRunResult({ ...RUN, status: 'RUNNING' })).toBe('em andamento');
  });
});
