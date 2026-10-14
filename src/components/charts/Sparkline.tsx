import { LineChart } from 'react-native-gifted-charts';
import { useWindowDimensions, View } from 'react-native';

import { SIZES } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

interface SparklineProps {
  /** Valores do período, do mais antigo ao mais recente. */
  values: readonly number[];
  /** Altura do gráfico em pontos. */
  height?: number;
  /** Largura do gráfico; por padrão, a largura da tela menos o padding. */
  width?: number;
  /** Descrição do gráfico lida pelo leitor de tela. */
  accessibilityLabel: string;
}

/**
 * Linha de tendência compacta, sem eixos nem preenchimento.
 *
 * A variação ocupa toda a altura, independente da faixa de valores. Não renderiza
 * nada com menos de 2 valores.
 *
 * @example
 * ```tsx
 * <Sparkline values={lastMonthRates} width={chartWidth} accessibilityLabel={t('home.rateTrend')} />
 * ```
 */
export function Sparkline({ values, height = 64, width, accessibilityLabel }: SparklineProps) {
  const { colors } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

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
