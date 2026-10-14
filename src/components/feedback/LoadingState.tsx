import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { FONTS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

interface LoadingStateProps {
  /** Texto opcional abaixo do indicador. */
  message?: string;
}

/**
 * Indicador de carregamento acessível, centralizado no espaço disponível.
 *
 * @example
 * ```tsx
 * <LoadingState />
 * ```
 */
export function LoadingState({ message }: LoadingStateProps) {
  const { colors } = useTheme();

  return (
    <View accessibilityRole="progressbar" style={styles.container}>
      <ActivityIndicator color={colors.highlight} />
      {message ? (
        <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: SIZES.touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.itemGap,
  },
  message: { fontFamily: FONTS.body, fontSize: TYPE.secondary },
});
