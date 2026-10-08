import { LineChart } from 'react-native-gifted-charts';
import { useWindowDimensions, View } from 'react-native';

import { SIZES } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

/** Propriedades do gráfico compacto sem eixos. */
type SparklineProps = {
  /** Valores em ordem cronológica. */
  values: readonly number[];
  /** Altura em pixels. @default 60 */
  height?: number;
  /** Descrição acessível do gráfico. */
  accessibilityLabel: string;
};

/**
 * Série temporal curta com linha menta e área preenchida.
 *
 * @example
 * ```tsx
 * <Sparkline values={lastMonthRates} accessibilityLabel={chartDescription} />
 * ```
 */
export function Sparkline({ values, height = 60, accessibilityLabel }: SparklineProps) {
  const { width: screenWidth } = useWindowDimensions();
  const { colors } = useTheme();
  const data = values.map((value) => ({ value }));

  if (data.length < 2) return null;

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <LineChart
        data={data}
        width={Math.max(120, screenWidth - SIZES.screenPadding * 2)}
        height={height}
        areaChart
        curved
        color={colors.accent}
        thickness={2}
        startFillColor={colors.accent}
        endFillColor={colors.accent}
        startOpacity={0.24}
        endOpacity={0}
        hideAxesAndRules
        hideDataPoints
        disableScroll
        initialSpacing={4}
        endSpacing={4}
        yAxisThickness={0}
        xAxisThickness={0}
      />
    </View>
  );
}
