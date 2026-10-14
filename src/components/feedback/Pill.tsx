import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { FONTS, RADIUS, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

type PillTone = 'info' | 'success' | 'warning' | 'error' | 'onBrand' | 'onBrandSolid';

interface PillProps {
  /** Texto do selo. */
  label: string;
  /** Cor do selo: `info`, `success`, `warning`, `error`, ou `onBrand`/`onBrandSolid` para cards escuros. */
  tone?: PillTone;
  /** Estilo extra do texto. */
  style?: StyleProp<TextStyle>;
}

/**
 * Selo compacto em formato de pílula, para status e rótulos curtos.
 *
 * Os tons `onBrand` e `onBrandSolid` são para usar sobre o card verde escuro,
 * como "USD → BRL" no Início e a variação de 12 meses no onboarding.
 *
 * @example
 * ```tsx
 * <Pill label={t('home.featuredPairCode')} tone="onBrand" />
 * ```
 */
export function Pill({ label, tone = 'info', style }: PillProps) {
  const { colors } = useTheme();
  const palette = {
    info: [colors.mintSoft, colors.highlightText],
    success: [colors.successBackground, colors.successText],
    warning: [colors.warningBackground, colors.warningText],
    error: [colors.warningBackground, colors.statusFailure],
    onBrand: [colors.pillOnBrand, colors.accent],
    onBrandSolid: [colors.accent, colors.textOnAccent],
  }[tone];

  return (
    <Text style={[styles.pill, { backgroundColor: palette[0], color: palette[1] }, style]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
    fontFamily: FONTS.bodySemiBold,
    fontSize: TYPE.caption,
  },
});
