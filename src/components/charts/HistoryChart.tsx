import { LineChart } from 'react-native-gifted-charts';
import { useWindowDimensions, View, Text, StyleSheet } from 'react-native';

import { useTheme } from '@theme/ThemeProvider';
import { SIZES, FONTS, TYPE, RADIUS } from '@constants/theme';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { formatDate, formatMoney } from '@utils/format.util';

/** Ponto de cotação no histórico. */
export type HistoryPoint = {
  /** Valor numérico da cotação. */
  value: number;
  /** Rótulo curto do eixo X. */
  label: string;
  /** Data ISO completa usada no tooltip. */
  date?: string;
};

/** Propriedades do gráfico interativo de histórico. */
type HistoryChartProps = {
  /** Pontos em ordem cronológica. */
  data: readonly HistoryPoint[];
  /** Código da moeda usada no tooltip. */
  currency: CurrencyCodeValue;
  /** Descrição acessível do gráfico. */
  accessibilityLabel: string;
  /** Permite selecionar um ponto para mostrar o tooltip. @default true */
  interactive?: boolean;
  /** Anima o desenho da linha ao abrir. @default false */
  animated?: boolean;
  /** Altura do gráfico em pixels. @default 220 */
  height?: number;
  /** Largura explícita quando o gráfico está dentro de um card. */
  width?: number;
  /** Ajusta o eixo vertical aos valores da série. @default false */
  fitData?: boolean;
  /** Mostra eixos e rótulos. @default true */
  showAxes?: boolean;
};

/**
 * Gráfico com área preenchida e tooltip de valor/data ao tocar.
 *
 * @example
 * ```tsx
 * <HistoryChart data={history} currency="BRL" accessibilityLabel={chartDescription} />
 * ```
 */
export function HistoryChart({
  data,
  currency,
  accessibilityLabel,
  interactive = true,
  animated = false,
  height = 220,
  width,
  fitData = false,
  showAxes = true,
}: HistoryChartProps) {
  const { width: screenWidth } = useWindowDimensions();
  const { colors } = useTheme();

  if (data.length < 2) return null;
  const minValue = Math.min(...data.map(({ value }) => value));
  const maxValue = Math.max(...data.map(({ value }) => value));
  const valueRange = Math.max(maxValue - minValue, 0.0001);

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <LineChart
        data={data.map(({ value, label }) => ({ value, label }))}
        width={width ?? Math.max(120, screenWidth - SIZES.screenPadding * 2)}
        height={height}
        areaChart
        curved
        isAnimated={animated}
        maxValue={fitData ? valueRange * 1.12 : undefined}
        yAxisOffset={fitData ? minValue : undefined}
        hideAxesAndRules={!showAxes}
        hideDataPoints={!interactive}
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
        yAxisLabelWidth={showAxes ? undefined : 0}
        xAxisLabelTextStyle={{ color: colors.textWeak, fontSize: TYPE.caption }}
        pointerConfig={
          interactive
            ? {
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
                      <Text style={[styles.tooltipDate, { color: colors.textSecondary }]}>
                        {label}
                      </Text>
                    </View>
                  );
                },
              }
            : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tooltip: { minHeight: 46, padding: 8, borderWidth: 1, borderRadius: RADIUS.option },
  tooltipValue: { fontFamily: FONTS.bodySemiBold, fontSize: TYPE.secondary },
  tooltipDate: { fontFamily: FONTS.body, fontSize: TYPE.caption },
});
