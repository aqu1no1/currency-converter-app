import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ListRow } from '@components/list/ListRow';
import { Icon } from '@components/icons/Icon';
import { FONTS, RADIUS, SIZES, TYPE } from '@constants/theme';
import type { SyncRunStatusDto } from '@dtos/sync-status.dto';
import { getRelativeDay, type RelativeDay } from '@utils/date.util';
import { formatDate, formatShortDate, formatTime } from '@utils/format.util';
import { useTheme } from '@theme/ThemeProvider';

const SYNCED_MESSAGE_KEYS = {
  today: 'home.syncedTodayAt',
  yesterday: 'home.syncedYesterdayAt',
  other: 'home.syncedOnAt',
} as const satisfies Record<RelativeDay, string>;

interface HomeSyncStatusProps {
  /** Última execução da sincronização da API, ou `null` se ainda não houver. */
  lastRun: SyncRunStatusDto | null;
  /** Se a consulta do status da sincronização falhou. */
  hasError: boolean;
  /** Data das cotações em uso (`AAAA-MM-DD`), mostrada no aviso de falha. */
  quoteDate: string;
  /** Ação do toque, normalmente abrir Ajustes. */
  onPress: () => void;
}

/**
 * Linha do Início com o status da última sincronização das cotações.
 *
 * Mostra "Sincronizado hoje/ontem/em dd/mm às HH:MM" no fuso do aparelho. Quando a
 * última sincronização terminou com erro, vira um aviso laranja com "A última
 * atualização falhou" e a data das cotações em uso.
 *
 * @example
 * ```tsx
 * <HomeSyncStatus
 *   lastRun={sync.data?.lastRun ?? null}
 *   hasError={sync.isError}
 *   quoteDate={latestUsd.data.date}
 *   onPress={openSettings}
 * />
 * ```
 */
export function HomeSyncStatus({ lastRun, hasError, quoteDate, onPress }: HomeSyncStatusProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  if (lastRun?.status === 'FAILED') {
    const date = formatDate(quoteDate);

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('home.syncFailedLabel', { date })}
        onPress={onPress}
        style={({ pressed }) => [
          styles.row,
          styles.warning,
          { backgroundColor: colors.warningBackground, borderColor: colors.warningBorder },
          pressed && styles.pressed,
        ]}
      >
        <Icon name="syncAlert" size={22} color={colors.warningText} />
        <View style={styles.copy}>
          <Text style={[styles.title, { color: colors.warningText }]}>{t('home.syncFailed')}</Text>
          <Text style={[styles.subtitle, { color: colors.warningText }]}>
            {t('home.syncFailedDate', { date })}
          </Text>
        </View>
        <Icon name="chevronRight" size={18} color={colors.warningText} />
      </Pressable>
    );
  }

  const time = lastRun?.finishedAt ?? lastRun?.startedAt;
  const message =
    lastRun?.status === 'SUCCESS' && time
      ? t(SYNCED_MESSAGE_KEYS[getRelativeDay(time)], {
          date: formatShortDate(time),
          time: formatTime(time),
        })
      : t('home.syncUnavailable');

  return (
    <ListRow
      title={message}
      leading={
        <View
          style={[
            styles.statusDot,
            { backgroundColor: hasError ? colors.statusFailure : colors.highlight },
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
  warning: {
    paddingVertical: SIZES.itemGap,
    paddingHorizontal: SIZES.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.itemGap,
  },
  pressed: { opacity: 0.85 },
  copy: { flex: 1, gap: 2 },
  title: { fontFamily: FONTS.bodySemiBold, fontSize: TYPE.body, lineHeight: TYPE.body * 1.35 },
  subtitle: { fontFamily: FONTS.body, fontSize: TYPE.secondary, lineHeight: TYPE.secondary * 1.35 },
  statusDot: { width: 10, height: 10, borderRadius: RADIUS.pill },
});
