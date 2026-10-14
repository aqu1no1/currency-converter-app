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

interface HistoryChartProps {
  /** Pontos do gráfico, do mais antigo ao mais recente. */
  data: readonly HistoryPoint[];
  /** Moeda usada para formatar o valor no tooltip. */
  currency: CurrencyCodeValue;
  /** Descrição do gráfico lida pelo leitor de tela. */
  accessibilityLabel: string;
  /** Mostra pontos e o tooltip com valor e data ao tocar. */
  interactive?: boolean;
  /** Anima o desenho da linha ao abrir. */
  animated?: boolean;
  /** Altura do gráfico em pontos. */
  height?: number;
  /** Largura do gráfico; por padrão, a largura da tela menos o padding. */
  width?: number;
  /** Começa o eixo vertical no menor valor, para a variação ocupar toda a altura. */
  fitData?: boolean;
  /** Mostra os eixos e os rótulos. */
  showAxes?: boolean;
  /** Desenha a linha curva em vez de reta. */
  curved?: boolean;
  /** Espessura da linha. */
  thickness?: number;
  /** Opacidade fixa do preenchimento; sem ela, o preenchimento é um degradê. */
  fillOpacity?: number;
  /** Destaca o último ponto com uma bolinha. */
  highlightLast?: boolean;
}

/**
 * Gráfico de linha do histórico de cotações, feito com `react-native-gifted-charts`.
 *
 * Os pontos são distribuídos na largura disponível. Sem eixos, vira o gráfico
 * compacto do onboarding; com `interactive`, mostra o valor e a data do ponto tocado.
 *
 * @example
 * ```tsx
 * <HistoryChart
 *   data={points}
 *   currency="BRL"
 *   height={170}
 *   showAxes={false}
 *   curved={false}
 *   highlightLast
 *   accessibilityLabel={t('onboarding.step2Title')}
 * />
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
  const { colors } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

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
