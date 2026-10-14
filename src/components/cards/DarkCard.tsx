import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { RADIUS, SIZES } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

type DarkCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;
/**
 * [EN] Renders a branded dark card with shared padding and rounded corners.
 * [PT-BR] Renderiza um cartão escuro de marca com padding e cantos arredondados.
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
