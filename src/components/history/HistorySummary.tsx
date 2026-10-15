import { StyleSheet, Text, View } from 'react-native';

import { FONTS, RADIUS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

export type HistorySummaryItem = {
  label: string;

  value: string;

  date: string;
};

interface HistorySummaryProps {
  /** Título da seção, como "Resumo do período". */
  title: string;
  /** Cartões da grade, cada um com rótulo, valor e data já formatados. */
  items: readonly HistorySummaryItem[];
}

/**
 * Seção com título e uma grade de duas colunas de cartões com valor e data.
 *
 * Usada no Histórico para o início do período, a cotação mais recente, a mínima
 * e a máxima.
 *
 * @example
 * ```tsx
 * <HistorySummary
 *   title={t('history.summary')}
 *   items={[{ label: t('history.minimum'), value: '5,1234', date: '02/09/2026' }]}
 * />
 * ```
 */
export function HistorySummary({ title, items }: HistorySummaryProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={[styles.title, { color: colors.textHeading }]}>
        {title}
      </Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <View
            key={item.label}
            accessible
            style={[
              styles.card,
              { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.label, { color: colors.textSecondary }]}>{item.label}</Text>
            <Text style={[styles.value, { color: colors.textHeading }]}>{item.value}</Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>{item.date}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: SIZES.itemGap },
  title: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: TYPE.section,
    lineHeight: TYPE.section * 1.3,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SIZES.itemGap },
  card: {
    flexBasis: '45%',
    flexGrow: 1,
    paddingVertical: SIZES.itemGap,
    paddingHorizontal: SIZES.cardPadding,
    borderWidth: 1,
    borderRadius: RADIUS.button,
    gap: 4,
  },
  label: {
    fontFamily: FONTS.bodyMedium,
    fontSize: TYPE.caption,
    lineHeight: TYPE.caption * 1.35,
  },
  value: {
    fontFamily: FONTS.display,
    fontSize: TYPE.value,
    lineHeight: TYPE.value * 1.2,
    fontVariant: ['tabular-nums'],
  },
  date: { fontFamily: FONTS.body, fontSize: TYPE.caption, lineHeight: TYPE.caption * 1.35 },
});
