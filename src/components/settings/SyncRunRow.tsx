import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Pill } from '@components/feedback/Pill';
import { FONTS, RADIUS, SIZES, TYPE } from '@constants/theme';
import type { SyncRunDto } from '@dtos/sync-runs.dto';
import { formatLocalDate, formatTime } from '@utils/format.util';
import { describeRunResult } from '@utils/sync.util';
import { useTheme } from '@theme/ThemeProvider';

const DOT_SIZE = 10;

interface SyncRunRowProps {
  /** Execução da sincronização vinda do `GET /sync`. */
  run: SyncRunDto;
}

/**
 * Linha de 64 com uma execução da sincronização: ponto e selo de status, início e detalhe.
 *
 * O detalhe junta o tipo (Diária ou Carga inicial) com as linhas gravadas e a duração,
 * ou com o erro quando a execução falhou. Fica dentro de um `ListBox`.
 *
 * @example
 * ```tsx
 * <ListBox>
 *   {runs.map((run) => <SyncRunRow key={run.id} run={run} />)}
 * </ListBox>
 * ```
 */
export function SyncRunRow({ run }: SyncRunRowProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const failed = run.status === 'FAILED';
  const status = t(`settings.runStatus.${run.status}`);
  const date = formatLocalDate(run.startedAt);
  const time = formatTime(run.startedAt);
  const detail = t('settings.runDetail', {
    type: t(`settings.runTypes.${run.type}`),
    detail: describeRunResult(run),
  });

  return (
    <View
      accessible
      accessibilityLabel={t('settings.runLabel', {
        type: t(`settings.runTypes.${run.type}`),
        date,
        time,
        status,
        detail: describeRunResult(run),
      })}
      style={styles.row}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: failed ? colors.statusFailure : colors.statusSuccess },
        ]}
      />
      <View style={styles.copy}>
        <Text style={[styles.start, { color: colors.textPrimary }]}>
          {t('settings.runStart', { date, time })}
        </Text>
        <Text numberOfLines={1} style={[styles.detail, { color: colors.textSecondary }]}>
          {detail}
        </Text>
      </View>
      <Pill
        label={status}
        tone={failed ? 'warning' : run.status === 'RUNNING' ? 'info' : 'success'}
        style={styles.pill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { alignSelf: 'center' },
  row: {
    minHeight: SIZES.listRow,
    paddingVertical: SIZES.itemGap,
    paddingHorizontal: SIZES.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.itemGap,
  },
  dot: { width: DOT_SIZE, height: DOT_SIZE, borderRadius: RADIUS.pill },
  copy: { flex: 1, minWidth: 0, gap: 2 },
  start: { fontFamily: FONTS.bodySemiBold, fontSize: TYPE.body, lineHeight: TYPE.body * 1.35 },
  detail: { fontFamily: FONTS.body, fontSize: TYPE.secondary, lineHeight: TYPE.secondary * 1.35 },
});
