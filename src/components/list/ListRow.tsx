import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon } from '@components/icons/Icon';
import type { IconName } from '@constants/icons';
import { FONTS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

type ListRowProps = {
  leading?: ReactNode;

  title: string;

  subtitle?: string;

  value?: string;
  trailing?: ReactNode;

  icon?: IconName;

  onPress?: () => void;

  accessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;
};
/**
 * [EN] Displays a list item with optional leading content, subtitle, and value.
 * [PT-BR] Exibe um item de lista com conteúdo inicial, subtítulo e valor opcionais.
 *
 * @example
 * ```tsx
 * <ListRow title="Dólar americano" subtitle="USD" value="R$ 5,20" onPress={openCurrency} />
 * ```
 */

export function ListRow({
  title,
  subtitle,
  value,
  icon,
  leading,
  trailing,
  onPress,
  accessibilityLabel,
  style,
}: ListRowProps) {
  const { colors } = useTheme();
  const content = (
    <>
      {leading}
      {icon ? <Icon name={icon} size={22} color={colors.textSecondary} /> : null}
      <View style={styles.copy}>
        <Text
          numberOfLines={1}
          style={[subtitle ? styles.title : styles.label, { color: colors.textPrimary }]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? <Text style={[styles.value, { color: colors.textHeading }]}>{value}</Text> : null}
      {trailing}
    </>
  );

  const rowStyle = [styles.row, style];
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={rowStyle}
    >
      {content}
    </Pressable>
  ) : (
    <View style={rowStyle}>{content}</View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: SIZES.listRow,
    paddingVertical: SIZES.itemGap,
    paddingHorizontal: SIZES.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.itemGap,
  },
  copy: { flex: 1, gap: 2 },
  title: { fontFamily: FONTS.bodySemiBold, fontSize: TYPE.body, lineHeight: TYPE.body * 1.35 },
  label: { fontFamily: FONTS.body, fontSize: TYPE.body, lineHeight: TYPE.body * 1.35 },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: TYPE.secondary,
    lineHeight: TYPE.secondary * 1.35,
  },
  value: {
    fontFamily: FONTS.display,
    fontSize: TYPE.value,
    lineHeight: TYPE.value * 1.2,
    fontVariant: ['tabular-nums'],
  },
});
