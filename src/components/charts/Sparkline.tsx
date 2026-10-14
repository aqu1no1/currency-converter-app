import { LineChart } from 'react-native-gifted-charts';
import { useWindowDimensions, View } from 'react-native';

import { SIZES } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

type SparklineProps = {
  values: readonly number[];

  height?: number;

  width?: number;

  accessibilityLabel: string;
};
/**
 * [EN] Draws a compact trend chart without axes.
 * [PT-BR] Desenha um gráfico compacto de tendência sem eixos.
 *
 * @example
 * ```tsx
 * <Sparkline values={lastMonthRates} accessibilityLabel={chartDescription} />
 * ```
 */

export function Sparkline({ values, height = 64, width, accessibilityLabel }: SparklineProps) {
  const { width: screenWidth } = useWindowDimensions();
  const { colors } = useTheme();

  if (values.length < 2) return null;

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = Math.max(maxValue - minValue, 0.000001);
  const data = values.map((value) => ({ value: value - minValue }));

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <LineChart
        data={data}
        width={width ?? Math.max(120, screenWidth - SIZES.screenPadding * 2)}
        height={height}
        maxValue={range * 1.12}
        mostNegativeValue={0}
        noOfSections={1}
        color={colors.accent}
        thickness={2.5}
        hideAxesAndRules
        hideDataPoints
        yAxisLabelWidth={0}
        disableScroll
        adjustToWidth
        initialSpacing={0}
        endSpacing={0}
        yAxisThickness={0}
        xAxisThickness={0}
      />
    </View>
  );
}
