import { TIME_IN_MS, TIME_IN_SECONDS } from '@constants/time.constants';
import type { SyncRunState } from '@dtos/sync-status.dto';
import { i18n } from '@lib/i18n';
import { formatInteger } from '@utils/format.util';

type RunResult = {
  status: SyncRunState;
  startedAt: string;
  finishedAt?: string | null;
  rowsInserted: number;
  errorMessage?: string | null;
};

export function getRunDurationSeconds({ startedAt, finishedAt }: RunResult): number | null {
  if (!finishedAt) return null;
  const elapsed = new Date(finishedAt).getTime() - new Date(startedAt).getTime();
  return Math.max(0, Math.round(elapsed / TIME_IN_MS.SECOND));
}

export function formatRunDuration(seconds: number): string {
  if (seconds < TIME_IN_SECONDS.MINUTE) {
    return i18n.t('settings.durationSeconds', { count: seconds });
  }
  return i18n.t('settings.durationMinutes', {
    count: Math.round(seconds / TIME_IN_SECONDS.MINUTE),
  });
}

export function formatRunRows(run: RunResult): string {
  const rows = i18n.t('settings.runRows', {
    count: run.rowsInserted,
    value: formatInteger(run.rowsInserted),
  });
  const duration = getRunDurationSeconds(run);

  return duration === null
    ? rows
    : i18n.t('settings.runRowsIn', { rows, duration: formatRunDuration(duration) });
}

export function describeRunResult(run: RunResult): string {
  if (run.status === 'RUNNING') return i18n.t('settings.runRunning');
  if (run.status === 'FAILED') return run.errorMessage ?? i18n.t('settings.runFailed');
  return formatRunRows(run);
}
