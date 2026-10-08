import { LineChart } from 'react-native-gifted-charts';
import { useWindowDimensions, View, Text, StyleSheet } from 'react-native';

import { useTheme } from '@theme/ThemeProvider';
import { SIZES, FONTS, TYPE, RADIUS } from '@constants/theme';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { formatDate, formatMoney } from '@utils/format.util';

export type HistoryPoint = { value: number; label: string; date?: string };

type HistoryChartProps = {
  data: readonly HistoryPoint[];
  currency: CurrencyCodeValue;
  accessibilityLabel: string;
};

export function HistoryChart({ data, currency, accessibilityLabel }: HistoryChartProps) {
  const { width: screenWidth } = useWindowDimensions();
  const { colors } = useTheme();

  if (data.length < 2) return null;

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <LineChart
        data={data.map(({ value, label }) => ({ value, label }))}
        width={Math.max(120, screenWidth - SIZES.screenPadding * 2)}
        height={220}
        areaChart
        curved
        color={colors.accent}
        thickness={2}
        startFillColor={colors.accent}
        endFillColor={colors.accent}
        startOpacity={0.2}
        endOpacity={0.02}
        hideRules
        xAxisColor={colors.border}
        xAxisThickness={1}
        yAxisThickness={0}
        yAxisTextStyle={{ color: colors.textWeak, fontSize: TYPE.caption }}
        xAxisLabelTextStyle={{ color: colors.textWeak, fontSize: TYPE.caption }}
        pointerConfig={{
          pointerColor: colors.accent,
          pointerStripColor: colors.borderStrong,
          pointerStripHeight: 180,
          pointerLabelWidth: 156,
          pointerLabelHeight: 50,
          autoAdjustPointerLabelPosition: true,
          pointerLabelComponent: (items: HistoryPoint[]) => {
            const point = items[0];
            if (!point) return null;

            const source = data.find(
              (item) => item.label === point.label && item.value === point.value,
            );
            const label = source?.date ? formatDate(source.date) : point.label;

            return (
              <View
                style={[
                  styles.tooltip,
                  { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.tooltipValue, { color: colors.textPrimary }]}>
                  {formatMoney(point.value, currency)}
                </Text>
                <Text style={[styles.tooltipDate, { color: colors.textSecondary }]}>{label}</Text>
              </View>
            );
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tooltip: { minHeight: 46, padding: 8, borderWidth: 1, borderRadius: RADIUS.option },
  tooltipValue: { fontFamily: FONTS.bodySemiBold, fontSize: TYPE.secondary },
  tooltipDate: { fontFamily: FONTS.body, fontSize: TYPE.caption },
});
