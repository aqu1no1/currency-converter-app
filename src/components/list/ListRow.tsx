import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon } from '@components/icons/Icon';
import type { IconName } from '@constants/icons';
import { FONTS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

type ListRowProps = {
  title: string;
  subtitle?: string;
  value?: string;
  icon?: IconName;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

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
