import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { FONTS, RADIUS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

type PillTone = 'info' | 'success' | 'warning' | 'error';

type PillProps = {
  label: string;
  tone?: PillTone;
  style?: StyleProp<TextStyle>;
};

export function Pill({ label, tone = 'info', style }: PillProps) {
  const { colors } = useTheme();
  const palette = {
    info: [colors.mintSoft, colors.highlightText],
    success: [colors.successBackground, colors.successText],
    warning: [colors.warningBackground, colors.warningText],
    error: [colors.warningBackground, colors.statusFailure],
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
    paddingHorizontal: SIZES.itemGap,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
    fontFamily: FONTS.bodySemiBold,
    fontSize: TYPE.caption,
  },
});
