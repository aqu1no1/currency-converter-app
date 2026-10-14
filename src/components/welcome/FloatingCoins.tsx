import { useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { FONTS } from '@constants/theme';
import { TIME_IN_MS } from '@constants/time.constants';
import { useReduceMotion } from '@hooks/useReduceMotion';
import { useTheme } from '@theme/ThemeProvider';

const FLOAT_DISTANCE = 16;

const COINS = [
  { symbol: '$', left: 0.08, top: 0.14, size: 54, font: 20, seconds: 9, phase: 2 / 9 },
  { symbol: '€', left: 0.76, top: 0.1, size: 62, font: 23, seconds: 11, phase: 5 / 11 },
  { symbol: '£', left: 0.84, top: 0.42, size: 46, font: 17, seconds: 8, phase: 1 / 8 },
  { symbol: '¥', left: 0.04, top: 0.48, size: 50, font: 19, seconds: 10, phase: 4 / 10 },
  { symbol: 'R$', left: 0.72, top: 0.68, size: 58, font: 22, seconds: 12, phase: 7 / 12 },
  { symbol: '元', left: 0.12, top: 0.7, size: 44, font: 16, seconds: 9, phase: 3 / 9 },
] as const;

type CoinProps = (typeof COINS)[number] & {
  /** Largura da tela, usada para posicionar a moeda. */
  width: number;
  /** Altura da tela, usada para posicionar a moeda. */
  height: number;
  /** Se a moeda flutua; falso com "reduzir movimento". */
  animate: boolean;
};

/**
 * Uma moeda decorativa das Boas-vindas, com símbolo, posição e ritmo próprios.
 *
 * Sobe e desce 16 pontos em loop, começando na fase definida em `COINS`.
 *
 * @example
 * ```tsx
 * <Coin {...COINS[0]} width={width} height={height} animate />
 * ```
 */
function Coin({
  symbol,
  left,
  top,
  size,
  font,
  seconds,
  phase,
  width,
  height,
  animate,
}: CoinProps) {
  const { colors } = useTheme();
  const progress = useSharedValue<number>(phase);

  const floating = useAnimatedStyle(() => ({
    transform: [
      { translateY: (-FLOAT_DISTANCE * (1 - Math.cos(2 * Math.PI * progress.get()))) / 2 },
    ],
  }));

  useEffect(() => {
    if (!animate) {
      cancelAnimation(progress);
      progress.set(phase);
      return;
    }

    const duration = seconds * TIME_IN_MS.SECOND;
    const loop = { duration, easing: Easing.linear, reduceMotion: ReduceMotion.System };

    progress.set(
      withSequence(
        withTiming(1, { ...loop, duration: duration * (1 - phase) }),
        withRepeat(withSequence(withTiming(0, { duration: 0 }), withTiming(1, loop)), -1),
      ),
    );

    return () => cancelAnimation(progress);
  }, [animate, seconds, phase, progress]);

  return (
    <Animated.View
      testID={`floating-coin-${symbol}`}
      style={[
        styles.coin,
        {
          left: left * width,
          top: top * height,
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: colors.coinBorderOnBrand,
        },
        floating,
      ]}
    >
      <Text style={[styles.symbol, { fontSize: font, color: colors.coinTextOnBrand }]}>
        {symbol}
      </Text>
    </Animated.View>
  );
}

/**
 * Moedas decorativas flutuando no fundo da tela de Boas-vindas.
 *
 * São seis símbolos ($, €, £, ¥, R$, 元) em posições relativas à tela, cada um com
 * seu próprio ritmo. Ficam parados com "reduzir movimento" e são ignorados pelo
 * leitor de tela.
 *
 * @example
 * ```tsx
 * <View style={{ flex: 1 }}>
 *   <FloatingCoins />
 * </View>
 * ```
 */
export function FloatingCoins() {
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReduceMotion();

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      testID="floating-coins"
    >
      {COINS.map((coin) => (
        <Coin
          key={coin.symbol}
          {...coin}
          width={width}
          height={height}
          animate={reduceMotion === false}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  coin: {
    position: 'absolute',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontFamily: FONTS.display,
  },
});
