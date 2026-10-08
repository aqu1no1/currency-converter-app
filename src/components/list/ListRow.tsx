import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon } from '@components/icons/Icon';
import type { IconName } from '@constants/icons';
import { FONTS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

/** Propriedades de uma linha de lista. */
type ListRowProps = {
  /** Texto principal. */
  title: string;
  /** Texto secundário abaixo do título. */
  subtitle?: string;
  /** Valor alinhado à direita. */
  value?: string;
  /** Ícone opcional à esquerda. */
  icon?: IconName;
  /** Ação opcional ao tocar na linha. */
  onPress?: () => void;
  /** Estilo adicional da linha. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Linha com ícone, textos e valor opcional.
 *
 * @example
 * ```tsx
 * <ListRow title="Dólar americano" subtitle="USD" value="R$ 5,20" onPress={openCurrency} />
 * ```
 */
export function ListRow({ title, subtitle, value, icon, onPress, style }: ListRowProps) {
  const { colors } = useTheme();
  const content = (
    <>
      {icon ? <Icon name={icon} size={22} color={colors.textSecondary} /> : null}
      <View style={styles.copy}>
        <Text numberOfLines={1} style={[styles.title, { color: colors.textPrimary }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text> : null}
    </>
  );

  const rowStyle = [styles.row, { borderBottomColor: colors.divider }, style];
  return onPress ? (
    <Pressable accessibilityRole="button" onPress={onPress} style={rowStyle}>
      {content}
    </Pressable>
  ) : (
    <View style={rowStyle}>{content}</View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: SIZES.listRow,
    paddingHorizontal: SIZES.itemGap,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.itemGap,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  copy: { flex: 1, gap: 2 },
  title: { fontFamily: FONTS.bodySemiBold, fontSize: TYPE.body },
  subtitle: { fontFamily: FONTS.body, fontSize: TYPE.caption },
  value: { fontFamily: FONTS.bodyMedium, fontSize: TYPE.value },
});
