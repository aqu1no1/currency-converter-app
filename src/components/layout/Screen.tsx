import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';

import { SIZES } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

interface ScreenProps extends PropsWithChildren {
  /** Estilo extra da área segura. */
  style?: StyleProp<ViewStyle>;
  /** Estilo extra do conteúdo (que tem padding horizontal de 20). */
  contentStyle?: StyleProp<ViewStyle>;
  /** Bordas da área segura aplicadas; nas abas, `TAB_SCREEN_EDGES` deixa a inferior para a barra. */
  edges?: readonly Edge[];
}

/**
 * Contêiner base das telas, com área segura, fundo do tema e padding horizontal.
 *
 * @example
 * ```tsx
 * <Screen edges={TAB_SCREEN_EDGES}>
 *   <ScreenHeader title={t('tabs.converter')} />
 * </Screen>
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
