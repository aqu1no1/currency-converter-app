import { useEffect, useId, useState } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, G, Mask, Path, Rect } from 'react-native-svg';

import {
  LOGO_CURRENCY_GLYPHS,
  LOGO_STATIC_ARCS,
  LOGO_STATIC_GLYPH,
  LOGO_WORDMARK,
} from '@constants/logo.constants';
import { TIME_IN_MS } from '@constants/time.constants';
import { useReduceMotion } from '@hooks/useReduceMotion';
import { useTheme } from '@theme/ThemeProvider';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

const DIAMOND = 'M15 10.5L19.5 15L15 19.5L10.5 15Z';
const DIAMOND_GAP = 'M15 8.94L21.06 15L15 21.06L8.94 15Z';
const VIEW_BOX = { mark: '0 0 30 30', full: '1.5 1.5 144 27' } as const;
const ASPECT_RATIO = { mark: 1, full: 144 / 27 } as const;

const RING_RADIUS = 6.2;
const RING_NEAR = 9.8;
const RING_FAR = 20.2;

const RINGS_DURATION = 3.6 * TIME_IN_MS.SECOND;
const CURRENCY_DURATION = 1.8 * TIME_IN_MS.SECOND;
const CURRENCY_FADE = 0.25 * TIME_IN_MS.SECOND;

/** Props do componente Logo. */
type LogoProps = {
  /** `mark` mostra só o símbolo; `full` mostra o símbolo e a palavra "Converter". @default 'mark' */
  variant?: 'mark' | 'full';
  /** Cor do fundo onde o logo fica, que define a cor de dois anéis e da palavra. @default 'onLight' */
  tone?: 'onDark' | 'onLight';
  /** Altura em pixels. A largura segue a proporção da variante. @default 48 */
  size?: number;
};

/**
 * Logo do Converter desenhado com `react-native-svg`: quatro anéis em volta de um
 * diamante com a moeda. Os anéis se cruzam a cada 3,6 s e a moeda troca a cada
 * 1,8 s entre as 10 moedas. Com "reduzir movimento" ligado no sistema, mostra o
 * logo estático, com os anéis entrelaçados e o "$".
 *
 * @example
 * ```tsx
 * <Logo variant="mark" tone="onDark" size={160} />
 *
 * <Logo variant="full" tone="onLight" size={32} />
 * ```
 */
export function Logo({ variant = 'mark', tone = 'onLight', size = 48 }: LogoProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const animate = reduceMotion === false;

  const maskId = `logo-mask-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [rings] = useState(() => new Animated.Value(0));
  const [glyphOpacity] = useState(() => new Animated.Value(1));
  const [glyphIndex, setGlyphIndex] = useState(0);

  const contrast = tone === 'onDark' ? colors.white : colors.primary;
  const ringColor = { contrast, accent: colors.accent } as const;
  const glyph = LOGO_CURRENCY_GLYPHS[glyphIndex];

  const nearToFar = rings.interpolate({ inputRange: [0, 1], outputRange: [RING_NEAR, RING_FAR] });
  const farToNear = rings.interpolate({ inputRange: [0, 1], outputRange: [RING_FAR, RING_NEAR] });

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
      {animate ? (
        <>
          <Defs>
            <Mask id={maskId} maskUnits="userSpaceOnUse" x="-5" y="-5" width="40" height="40">
              <Rect x="-5" y="-5" width="40" height="40" fill="#fff" />
              <Path d={DIAMOND_GAP} fill="#000" />
            </Mask>
          </Defs>

          <G mask={`url(#${maskId})`} fill="none" strokeWidth={2}>
            <AnimatedCircle cx={nearToFar} cy={15} r={RING_RADIUS} stroke={contrast} />
            <AnimatedCircle cx={farToNear} cy={15} r={RING_RADIUS} stroke={colors.accent} />
            <AnimatedCircle cx={15} cy={nearToFar} r={RING_RADIUS} stroke={colors.accent} />
            <AnimatedCircle cx={15} cy={farToNear} r={RING_RADIUS} stroke={contrast} />
          </G>
        </>
      ) : (
        <G fill="none" strokeWidth={2} testID="logo-static">
          {LOGO_STATIC_ARCS.map((arc) => (
            <Path key={arc.d} d={arc.d} stroke={ringColor[arc.tone]} />
          ))}
        </G>
      )}

      <Path
        d={DIAMOND}
        fill={colors.accent}
        stroke={colors.accent}
        strokeWidth={0.8}
        strokeLinejoin="round"
      />

      {animate && glyph ? (
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
      ) : (
        <Path d={LOGO_STATIC_GLYPH} fill={colors.primary} testID="logo-currency-static" />
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
