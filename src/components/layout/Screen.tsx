import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';

import { SIZES } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

type ScreenProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;

  contentStyle?: StyleProp<ViewStyle>;

  edges?: readonly Edge[];
}>;
/**
 * [EN] Provides a safe-area screen container with shared horizontal spacing.
 * [PT-BR] Fornece um contêiner de tela com safe area e espaçamento horizontal padrão.
 *
 * @example
 * ```tsx
 * <Screen><ScreenHeader title={t('tabs.home')} /></Screen>
 * ```
 */

export function Screen({ children, style, contentStyle, edges }: ScreenProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.safeArea, { backgroundColor: colors.background }, style]}
    >
      <View style={[styles.content, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, paddingHorizontal: SIZES.screenPadding },
});
