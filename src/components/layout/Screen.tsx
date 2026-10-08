import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SIZES } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

type ScreenProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}>;

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
