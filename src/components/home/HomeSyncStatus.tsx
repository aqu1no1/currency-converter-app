import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { ListRow } from '@components/list/ListRow';
import { RADIUS, SIZES } from '@constants/theme';
import type { SyncRunStatusDto } from '@dtos/sync-status.dto';
import { formatTime } from '@utils/format.util';
import { useTheme } from '@theme/ThemeProvider';

type HomeSyncStatusProps = {
  /** Dados da execução mais recente, quando disponíveis. */
  lastRun: SyncRunStatusDto | null;
  /** Indica falha ao carregar o status. */
  hasError: boolean;
  /** Abre os ajustes de sincronização. */
  onPress: () => void;
};

/**
 * Home footer row showing the last synchronization result.
 *
 * @example
 * ```tsx
 * <HomeSyncStatus lastRun={status.lastRun} hasError={isError} onPress={openSettings} />
 * ```
 */
export function HomeSyncStatus({ lastRun, hasError, onPress }: HomeSyncStatusProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const succeeded = lastRun?.status === 'SUCCESS';
  const failed = lastRun?.status === 'FAILED';
  const time = lastRun?.finishedAt ?? lastRun?.startedAt;
  const message =
    succeeded && time
      ? t('home.syncedTodayAt', { time: formatTime(time) })
      : failed || hasError
        ? t('home.syncFailed')
        : t('home.syncUnavailable');

  return (
    <ListRow
      title={message}
      icon={failed || hasError ? 'error' : 'check'}
      onPress={onPress}
      style={[styles.row, { backgroundColor: colors.surfacePrimary, borderColor: colors.border }]}
    />
  );
}

const styles = StyleSheet.create({
  row: { marginTop: SIZES.sectionGap, borderWidth: 1, borderRadius: RADIUS.list },
});
