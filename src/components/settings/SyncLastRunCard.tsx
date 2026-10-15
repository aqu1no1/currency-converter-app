import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { DarkCard } from '@components/cards/DarkCard';
import { Pill } from '@components/feedback/Pill';
import { FONTS, RADIUS, SIZES, TYPE } from '@constants/theme';
import type { SyncRunStatusDto } from '@dtos/sync-status.dto';
import { formatDate, formatLocalDate, formatTime } from '@utils/format.util';
import { describeRunResult } from '@utils/sync.util';
import { useTheme } from '@theme/ThemeProvider';

interface SyncLastRunCardProps {
  /** Última execução diária da sincronização, ou `null` antes da primeira. */
  lastRun: SyncRunStatusDto | null;
  /** Data da cotação mais recente no banco (`AAAA-MM-DD`), ou `null`. */
  latestRateDate: string | null;
  /** Data da cotação mais antiga do histórico (`AAAA-MM-DD`). */
  historyStartDate: string;
}

/**
 * Card escuro dos Ajustes com a última execução da sincronização.
 *
 * Mostra o selo Sucesso/Falhou (texto e cor diferentes), quando rodou, quantas linhas
 * gravou e em quanto tempo (ou o erro), e as datas "Cotações até" e "Histórico desde".
 *
 * @example
 * ```tsx
 * <SyncLastRunCard
 *   lastRun={status.lastRun}
 *   latestRateDate={status.latestRateDate}
 *   historyStartDate={HISTORY_START_DATE}
 * />
 * ```
 */
export function SyncLastRunCard({
  lastRun,
  latestRateDate,
  historyStartDate,
}: SyncLastRunCardProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const renderDate = (label: string, value: string) => (
    <View style={[styles.date, { backgroundColor: colors.surfaceBrandOverlay }]}>
      <Text style={[styles.dateLabel, { color: colors.textOnBrandMuted }]}>{label}</Text>
      <Text style={[styles.dateValue, { color: colors.white }]}>{value}</Text>
    </View>
  );

  return (
    <DarkCard style={styles.card}>
      <View style={styles.heading}>
        <Text style={[styles.title, { color: colors.white }]}>{t('settings.lastRun')}</Text>
        {lastRun ? (
          <Pill
            label={t(`settings.runStatus.${lastRun.status}`)}
            tone={lastRun.status === 'FAILED' ? 'warning' : 'onBrandSolid'}
            style={styles.pill}
          />
        ) : null}
      </View>
      <Text style={[styles.summary, { color: colors.textOnBrandMuted }]}>
        {lastRun
          ? t('settings.runSummary', {
              date: formatLocalDate(lastRun.startedAt),
              time: formatTime(lastRun.startedAt),
              detail: describeRunResult({ ...lastRun, errorMessage: lastRun.error }),
            })
          : t('settings.noRuns')}
      </Text>
      <View style={styles.dates}>
        {renderDate(t('settings.ratesUntil'), latestRateDate ? formatDate(latestRateDate) : '—')}
        {renderDate(t('settings.historySince'), formatDate(historyStartDate))}
      </View>
    </DarkCard>
  );
}

const styles = StyleSheet.create({
  pill: { alignSelf: 'center' },
  card: { gap: SIZES.itemGap },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: FONTS.bodySemiBold, fontSize: TYPE.body, lineHeight: TYPE.body * 1.35 },
  summary: { fontFamily: FONTS.body, fontSize: TYPE.secondary, lineHeight: TYPE.secondary * 1.35 },
  dates: { flexDirection: 'row', gap: SIZES.itemGap },
  date: { flex: 1, padding: SIZES.itemGap, borderRadius: RADIUS.option, gap: 4 },
  dateLabel: { fontFamily: FONTS.body, fontSize: TYPE.caption, lineHeight: TYPE.caption * 1.35 },
  dateValue: {
    fontFamily: FONTS.display,
    fontSize: TYPE.value,
    lineHeight: TYPE.value * 1.2,
    fontVariant: ['tabular-nums'],
  },
});
