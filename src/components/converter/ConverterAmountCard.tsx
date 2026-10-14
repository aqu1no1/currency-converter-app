import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { DarkCard } from '@components/cards/DarkCard';
import { CurrencyBadge } from '@components/currency/CurrencyBadge';
import { FONTS, SIZES, TYPE } from '@constants/theme';
import { TIME_IN_MS } from '@constants/time.constants';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { useReduceMotion } from '@hooks/useReduceMotion';
import { useTheme } from '@theme/ThemeProvider';

const CARET_BLINK = 0.5 * TIME_IN_MS.SECOND;

interface ConverterAmountCardProps {
  /** Moeda ativa, de onde parte a conversão. */
  code: CurrencyCodeValue;
  /** Nome traduzido da moeda ativa. */
  name: string;
  /** Valor digitado já formatado com o símbolo (ex.: `R$ 1.234,5`). */
  amount: string;
  /** Texto de ajuda abaixo do valor. */
  hint: string;
  /** Rótulo lido antes do valor pelo leitor de tela. */
  accessibilityLabel: string;
}

/**
 * Card do Converter com a moeda ativa e o valor digitado.
 *
 * O valor aparece em display 40, com um cursor piscando a cada meio segundo
 * (parado com "reduzir movimento"), e diminui a fonte para caber em uma linha.
 *
 * @example
 * ```tsx
 * <ConverterAmountCard
 *   code={base}
 *   name={t(`currencies.${base}`)}
 *   amount={`${getCurrencySymbol(base)} ${formatAmountInput(amount)}`}
 *   hint={t('converter.hint')}
 *   accessibilityLabel={t('converter.amountLabel')}
 * />
 * ```
 */
export function ConverterAmountCard({
  code,
  name,
  amount,
  hint,
  accessibilityLabel,
}: ConverterAmountCardProps) {
  const { colors } = useTheme();

  const reduceMotion = useReduceMotion();

  const caretOpacity = useSharedValue(1);

  const caretStyle = useAnimatedStyle(() => ({ opacity: caretOpacity.get() }));

  useEffect(() => {
    if (reduceMotion !== false) {
      cancelAnimation(caretOpacity);
      caretOpacity.set(1);
      return;
    }

    const step = (toValue: number) =>
      withDelay(
        CARET_BLINK,
        withTiming(toValue, { duration: 0, reduceMotion: ReduceMotion.System }),
      );
    caretOpacity.set(withRepeat(withSequence(step(0), step(1)), -1));

    return () => cancelAnimation(caretOpacity);
  }, [caretOpacity, reduceMotion]);

  return (
    <DarkCard style={styles.card}>
      <View style={styles.currency}>
        <CurrencyBadge code={code} tone="accent" />
        <View style={styles.currencyCopy}>
          <Text style={[styles.code, { color: colors.textOnBrand }]}>{code}</Text>
          <Text style={[styles.caption, { color: colors.textOnBrandMuted }]}>{name}</Text>
        </View>
      </View>
      <View
        accessible
        accessibilityLabel={`${accessibilityLabel}: ${amount}`}
        accessibilityLiveRegion="polite"
        style={styles.amountRow}
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[styles.amount, { color: colors.textOnBrand }]}
        >
          {amount}
        </Text>
        <Animated.View style={[styles.caret, { backgroundColor: colors.accent }, caretStyle]} />
      </View>
      <Text style={[styles.caption, { color: colors.textOnBrandMuted }]}>{hint}</Text>
    </DarkCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: SIZES.itemGap },
  currency: { flexDirection: 'row', alignItems: 'center', gap: SIZES.itemGap },
  currencyCopy: { gap: 2 },
  code: { fontFamily: FONTS.bodySemiBold, fontSize: TYPE.body, lineHeight: TYPE.body * 1.35 },
  caption: {
    fontFamily: FONTS.body,
    fontSize: TYPE.secondary,
    lineHeight: TYPE.secondary * 1.35,
  },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  amount: {
    flexShrink: 1,
    fontFamily: FONTS.display,
    fontSize: TYPE.display,
    lineHeight: TYPE.display * 1.05,
    fontVariant: ['tabular-nums'],
  },
  caret: { width: 3, height: 36, borderRadius: 2 },
});
