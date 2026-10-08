import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SIZES } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

/** Propriedades do contêiner de tela. */
type ScreenProps = PropsWithChildren<{
  /** Estilo opcional do contêiner externo. */
  style?: StyleProp<ViewStyle>;
  /** Estilo opcional do conteúdo interno. */
  contentStyle?: StyleProp<ViewStyle>;
}>;

/**
 * Fundo e safe area padronizados para as telas do app.
 *
 * @example
 * ```tsx
 * <Screen><ScreenHeader title={t('tabs.home')} /></Screen>
 * ```
 */
export function Screen({ children, style, contentStyle }: ScreenProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }, style]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, paddingHorizontal: SIZES.screenPadding },
});
