import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { FONTS, RADIUS, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

type PillTone = 'info' | 'success' | 'warning' | 'error' | 'onBrand' | 'onBrandSolid';

type PillProps = {
  label: string;

  tone?: PillTone;

  style?: StyleProp<TextStyle>;
};
/**
 * [EN] Displays a compact status label with semantic styling.
 * [PT-BR] Exibe um rótulo compacto de status com estilo semântico.
 *
 * @example
 * ```tsx
 * <Pill label={statusLabel} tone="success" />
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
