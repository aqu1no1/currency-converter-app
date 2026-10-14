import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ListRow } from '@components/list/ListRow';
import { Icon } from '@components/icons/Icon';
import { RADIUS, SIZES } from '@constants/theme';
import type { SyncRunStatusDto } from '@dtos/sync-status.dto';
import { getRelativeDay, type RelativeDay } from '@utils/date.util';
import { formatShortDate, formatTime } from '@utils/format.util';
import { useTheme } from '@theme/ThemeProvider';

const SYNCED_MESSAGE_KEYS = {
  today: 'home.syncedTodayAt',
  yesterday: 'home.syncedYesterdayAt',
  other: 'home.syncedOnAt',
} as const satisfies Record<RelativeDay, string>;

type HomeSyncStatusProps = {
  lastRun: SyncRunStatusDto | null;

  hasError: boolean;

  onPress: () => void;
};
/**
 * [EN] Shows the latest synchronization result as a tappable row.
 * [PT-BR] Exibe o resultado da sincronização mais recente em uma linha acionável.
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
      ? t(SYNCED_MESSAGE_KEYS[getRelativeDay(time)], {
          date: formatShortDate(time),
          time: formatTime(time),
        })
      : failed || hasError
        ? t('home.syncFailed')
        : t('home.syncUnavailable');

  return (
    <ListRow
      title={message}
      leading={
        <View
          style={[
            styles.statusDot,
            { backgroundColor: failed || hasError ? colors.statusFailure : colors.highlight },
          ]}
        />
      }
      trailing={<Icon name="chevronRight" size={18} color={colors.textWeak} />}
      onPress={onPress}
      style={[styles.row, { backgroundColor: colors.surfacePrimary, borderColor: colors.border }]}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: SIZES.sectionGap,
    minHeight: SIZES.listRow,
    borderWidth: 1,
    borderRadius: RADIUS.list,
  },
  statusDot: { width: 10, height: 10, borderRadius: RADIUS.pill },
});
