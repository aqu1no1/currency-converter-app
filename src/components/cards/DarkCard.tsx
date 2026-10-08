import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { RADIUS, SIZES } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

/** Propriedades do cartão de destaque da marca. */
type DarkCardProps = PropsWithChildren<{
  /** Estilo adicional do cartão. */
  style?: StyleProp<ViewStyle>;
}>;

/**
 * Cartão verde de destaque com padding e raio definidos pelo tema.
 *
 * @example
 * ```tsx
 * <DarkCard><Text style={{ color: colors.white }}>{formattedRate}</Text></DarkCard>
 * ```
 */
export function DarkCard({ children, style }: DarkCardProps) {
  const { colors } = useTheme();

  return <View style={[styles.card, { backgroundColor: colors.primary }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { padding: SIZES.cardPadding, borderRadius: RADIUS.card },
});
