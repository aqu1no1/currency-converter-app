import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { RADIUS } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

type ListBoxProps = PropsWithChildren<{ style?: StyleProp<ViewStyle> }>;

export function ListBox({ children, style }: ListBoxProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.box,
        { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: 'hidden', borderWidth: 1, borderRadius: RADIUS.list },
});
