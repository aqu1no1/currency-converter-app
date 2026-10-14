import { LineChart } from 'react-native-gifted-charts';
import { useWindowDimensions, View, Text, StyleSheet } from 'react-native';

import { useTheme } from '@theme/ThemeProvider';
import { SIZES, FONTS, TYPE, RADIUS } from '@constants/theme';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { formatDate, formatMoney } from '@utils/format.util';

const LAST_POINT_RADIUS = 7;

export type HistoryPoint = {
  value: number;

  label: string;

  date?: string;
};

type HistoryChartProps = {
  data: readonly HistoryPoint[];

  currency: CurrencyCodeValue;

  accessibilityLabel: string;

  interactive?: boolean;

  animated?: boolean;

  height?: number;

  width?: number;

  fitData?: boolean;

  showAxes?: boolean;

  curved?: boolean;

  thickness?: number;

  fillOpacity?: number;

  highlightLast?: boolean;
};
/**
 * [EN] Draws exchange-rate history with optional axes, animation, and selection.
 * [PT-BR] Desenha o histórico de cotações com eixos, animação e seleção opcionais.
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
  curved = true,
  thickness = 2,
  fillOpacity,
  highlightLast = false,
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
        data={data.map(({ value, label }, index) => {
          const isLast = highlightLast && index === data.length - 1;
          return {
            value,
            label: showAxes ? label : undefined,
            ...(highlightLast && {
              hideDataPoint: !isLast,
              dataPointRadius: LAST_POINT_RADIUS,
              dataPointColor: colors.accent,
            }),
          };
        })}
        width={width ?? Math.max(120, screenWidth - SIZES.screenPadding * 2)}
        height={height}
        areaChart
        adjustToWidth
        disableScroll
        curved={curved}
        isAnimated={animated}
        maxValue={fitData ? valueRange * 1.12 : undefined}
        yAxisOffset={fitData ? minValue : undefined}
        hideAxesAndRules={!showAxes}
        hideDataPoints={!interactive && !highlightLast}
        color={colors.accent}
        thickness={thickness}
        startFillColor={colors.accent}
        endFillColor={colors.accent}
        startOpacity={fillOpacity ?? 0.2}
        endOpacity={fillOpacity ?? 0.02}
        hideRules
        xAxisColor={colors.border}
        xAxisThickness={showAxes ? 1 : 0}
        xAxisLabelsHeight={showAxes ? undefined : 0}
        initialSpacing={showAxes ? undefined : 0}
        endSpacing={showAxes ? undefined : highlightLast ? LAST_POINT_RADIUS : 0}
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
