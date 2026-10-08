import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { RADIUS, SIZES } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

type DarkCardProps = PropsWithChildren<{ style?: StyleProp<ViewStyle> }>;

export function DarkCard({ children, style }: DarkCardProps) {
  const { colors } = useTheme();

  return <View style={[styles.card, { backgroundColor: colors.primary }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { padding: SIZES.cardPadding, borderRadius: RADIUS.card },
});
