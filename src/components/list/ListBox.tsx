import { Children, Fragment, isValidElement, type PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { RADIUS } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

interface ListBoxProps extends PropsWithChildren {
  /** Estilo extra da caixa. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Caixa com borda que agrupa linhas de lista.
 *
 * Coloca uma divisória entre as linhas, sem divisória antes da primeira nem depois
 * da última.
 *
 * @example
 * ```tsx
 * <ListBox>
 *   <ListRow title="EUR" subtitle={t('currencies.EUR')} value="R$ 5,88" />
 *   <ListRow title="GBP" subtitle={t('currencies.GBP')} value="R$ 6,89" />
 * </ListBox>
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
