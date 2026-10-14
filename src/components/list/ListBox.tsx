import { Children, Fragment, isValidElement, type PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { RADIUS } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

type ListBoxProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;
/**
 * [EN] Groups list rows inside a bordered surface.
 * [PT-BR] Agrupa linhas de lista em uma superfície com borda.
 *
 * @example
 * ```tsx
 * <ListBox><ListRow title={currencyName} value={formattedRate} /></ListBox>
 * ```
 */

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
      {Children.toArray(children).map((child, index) => (
        <Fragment key={isValidElement(child) ? child.key : index}>
          {index > 0 ? (
            <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          ) : null}
          {child}
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: 'hidden', borderWidth: 1, borderRadius: RADIUS.list },
  divider: { height: 1 },
});
