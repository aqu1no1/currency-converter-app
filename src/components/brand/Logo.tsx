import { useEffect, useId, useState } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, G, Mask, Path, Rect } from 'react-native-svg';

import { LOGO_CURRENCY_GLYPHS, LOGO_WORDMARK } from '@constants/logo.constants';
import { TIME_IN_MS } from '@constants/time.constants';
import { useReduceMotion } from '@hooks/useReduceMotion';
import { useTheme } from '@theme/ThemeProvider';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

const DIAMOND = 'M15 10.5L19.5 15L15 19.5L10.5 15Z';
const VIEW_BOX = { mark: '2 4.5 26 21', full: '2 4.5 144 21' } as const;
const ASPECT_RATIO = { mark: 26 / 21, full: 144 / 21 } as const;

const RINGS_DURATION = 3.6 * TIME_IN_MS.SECOND;
const CURRENCY_DURATION = 1.8 * TIME_IN_MS.SECOND;
const CURRENCY_FADE = 0.25 * TIME_IN_MS.SECOND;
const RING_SHIFT = 6;

const STATIC_GLYPH = Math.max(
  LOGO_CURRENCY_GLYPHS.findIndex((glyph) => glyph.code === 'BRL'),
  0,
);

/** Props do componente Logo. */
type LogoProps = {
  /** `mark` mostra só o símbolo; `full` mostra o símbolo e a palavra "Converter". @default 'mark' */
  variant?: 'mark' | 'full';
  /** Cor do fundo onde o logo fica, que define a cor do anel da direita e da palavra. @default 'onLight' */
  tone?: 'onDark' | 'onLight';
  /** Altura em pixels. A largura segue a proporção da variante. @default 48 */
  size?: number;
};

/**
 * Logo do Converter desenhado com `react-native-svg`. Os anéis se cruzam a cada
 * 3,6 s e a moeda no diamante troca a cada 1,8 s entre as 10 moedas. Com
 * "reduzir movimento" ligado no sistema, fica parado no R$.
 */
export function Logo({ variant = 'mark', tone = 'onLight', size = 48 }: LogoProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const animate = reduceMotion === false;

  const maskId = `logo-mask-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [rings] = useState(() => new Animated.Value(0));
  const [glyphOpacity] = useState(() => new Animated.Value(1));
  const [glyphIndex, setGlyphIndex] = useState(STATIC_GLYPH);

  const contrast = tone === 'onDark' ? colors.white : colors.primary;
  const glyph = LOGO_CURRENCY_GLYPHS[animate ? glyphIndex : STATIC_GLYPH];

  useEffect(() => {
    if (!animate) {
      rings.setValue(0);
      return;
    }

    const timing = (toValue: number) =>
      Animated.timing(rings, {
        toValue,
        duration: RINGS_DURATION / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      });
    const loop = Animated.loop(Animated.sequence([timing(1), timing(0)]));

    loop.start();
    return () => loop.stop();
  }, [animate, rings]);

  useEffect(() => {
    if (!animate) {
      glyphOpacity.setValue(1);
      return;
    }

    const fade = (toValue: number) =>
      Animated.timing(glyphOpacity, {
        toValue,
        duration: CURRENCY_FADE,
        useNativeDriver: false,
      });
    const cycle = Animated.sequence([
      fade(1),
      Animated.delay(CURRENCY_DURATION - 2 * CURRENCY_FADE),
      fade(0),
    ]);

    glyphOpacity.setValue(0);
    cycle.start(({ finished }) => {
      if (finished) setGlyphIndex((index) => (index + 1) % LOGO_CURRENCY_GLYPHS.length);
    });
    return () => cycle.stop();
  }, [animate, glyphIndex, glyphOpacity]);

  return (
    <Svg
      width={size * ASPECT_RATIO[variant]}
      height={size}
      viewBox={VIEW_BOX[variant]}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Converter"
      testID="logo"
    >
      <Defs>
        <Mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="30" height="30">
          <Rect width="30" height="30" fill="#fff" />
          <Path d={DIAMOND} fill="#000" stroke="#000" strokeWidth={2.2} strokeLinejoin="round" />
        </Mask>
      </Defs>

      <G mask={`url(#${maskId})`}>
        <AnimatedCircle
          cx={rings.interpolate({ inputRange: [0, 1], outputRange: [12, 12 + RING_SHIFT] })}
          cy={15}
          r={8.5}
          fill="none"
          stroke={colors.accent}
          strokeWidth={2}
        />
        <AnimatedCircle
          cx={rings.interpolate({ inputRange: [0, 1], outputRange: [18, 18 - RING_SHIFT] })}
          cy={15}
          r={8.5}
          fill="none"
          stroke={contrast}
          strokeWidth={2}
        />
      </G>

      <Path
        d={DIAMOND}
        fill={colors.accent}
        stroke={colors.accent}
        strokeWidth={0.8}
        strokeLinejoin="round"
      />

      {glyph && (
        <AnimatedG
          opacity={glyphOpacity}
          fill={colors.primary}
          testID={`logo-currency-${glyph.code}`}
        >
          <Path
            d={glyph.d}
            transform={`translate(${glyph.x} ${glyph.y}) scale(${glyph.scale} -${glyph.scale})`}
          />
        </AnimatedG>
      )}

      {variant === 'full' && (
        <G
          fill={contrast}
          transform={`translate(${LOGO_WORDMARK.x} ${LOGO_WORDMARK.y}) scale(${LOGO_WORDMARK.scale} -${LOGO_WORDMARK.scale})`}
          testID="logo-wordmark"
        >
          {LOGO_WORDMARK.letters.map((letter) => (
            <Path key={letter.x} d={letter.d} transform={`translate(${letter.x} 0)`} />
          ))}
        </G>
      )}
    </Svg>
  );
}
