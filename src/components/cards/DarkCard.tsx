import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { RADIUS, SIZES } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

interface DarkCardProps extends PropsWithChildren {
  /** Estilo extra do card, como `gap` entre os filhos. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Card verde escuro da marca, com padding de 16 e cantos de 24.
 *
 * Base dos destaques das telas: o par do Início, o exemplo do onboarding e o
 * valor digitado no Converter.
 *
 * @example
 * ```tsx
 * <DarkCard style={{ gap: SIZES.itemGap }}>
 *   <Text style={{ color: colors.white }}>{formattedRate}</Text>
 * </DarkCard>
 * ```
 */
export function DarkCard({ children, style }: DarkCardProps) {
  const { colors } = useTheme();

  return <View style={[styles.card, { backgroundColor: colors.primary }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { padding: SIZES.cardPadding, borderRadius: RADIUS.card },
});
