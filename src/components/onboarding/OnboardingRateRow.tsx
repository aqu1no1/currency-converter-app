import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { CurrencyBadge } from '@components/currency/CurrencyBadge';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { FONTS, SIZES, TYPE } from '@constants/theme';
import { TIME_IN_MS } from '@constants/time.constants';
import { useReduceMotion } from '@hooks/useReduceMotion';
import { useTheme } from '@theme/ThemeProvider';

const PULSE_MIN_OPACITY = 0.55;
const PULSE_DURATION = 1.2 * TIME_IN_MS.SECOND;

interface OnboardingRateRowProps {
  /** Moeda da linha. */
  code: CurrencyCodeValue;
  /** Valor convertido já formatado. */
  value: string;
}

/**
 * Linha do card do primeiro passo do onboarding com uma moeda e o valor convertido.
 *
 * O valor pulsa a opacidade, desligado com "reduzir movimento".
 *
 * @example
 * ```tsx
 * <OnboardingRateRow code="EUR" value={formatMoney(amount, 'EUR')} />
 * ```
 */
export function OnboardingRateRow({ code, value }: OnboardingRateRowProps) {
  const { colors } = useTheme();

  const reduceMotion = useReduceMotion();

  const opacity = useSharedValue(1);

  const pulse = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  useEffect(() => {
    if (reduceMotion !== false) {
      cancelAnimation(opacity);
      opacity.set(1);
      return;
    }

    opacity.set(PULSE_MIN_OPACITY);
    opacity.set(
      withRepeat(
        withTiming(1, {
          duration: PULSE_DURATION,
          easing: Easing.inOut(Easing.ease),
          reduceMotion: ReduceMotion.System,
        }),
        -1,
        true,
      ),
    );

    return () => cancelAnimation(opacity);
  }, [opacity, reduceMotion]);

  return (
    <View style={[styles.row, { backgroundColor: colors.surfaceBrandOverlay }]}>
      <CurrencyBadge code={code} />
      <Text style={[styles.code, { color: colors.textOnBrand }]}>{code}</Text>
      <Animated.Text style={[styles.value, { color: colors.textOnBrand }, pulse]}>
        {value}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    paddingVertical: 8,
    paddingHorizontal: SIZES.itemGap,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.itemGap,
    borderRadius: 16,
  },
  code: { flex: 1, fontFamily: FONTS.bodySemiBold, fontSize: TYPE.body },
  value: { fontFamily: FONTS.display, fontSize: TYPE.value, fontVariant: ['tabular-nums'] },
});
