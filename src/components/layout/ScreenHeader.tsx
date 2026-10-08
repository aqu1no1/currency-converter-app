import { StyleSheet, Text, View } from 'react-native';

import { IconButton } from '@components/buttons/IconButton';
import type { IconName } from '@constants/icons';
import { FONTS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

type ScreenHeaderProps = {
  title: string;
  context?: string;
  action?: { icon: IconName; accessibilityLabel: string; onPress: () => void };
};

export function ScreenHeader({ title, context, action }: ScreenHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        {context ? (
          <Text style={[styles.context, { color: colors.textSecondary }]}>{context}</Text>
        ) : null}
        <Text accessibilityRole="header" style={[styles.title, { color: colors.textHeading }]}>
          {title}
        </Text>
      </View>
      {action ? (
        <IconButton
          name={action.icon}
          accessibilityLabel={action.accessibilityLabel}
          onPress={action.onPress}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: SIZES.itemGap },
  copy: { flex: 1, gap: 2 },
  context: { fontFamily: FONTS.bodyMedium, fontSize: TYPE.secondary },
  title: { fontFamily: FONTS.display, fontSize: TYPE.title, lineHeight: TYPE.title * 1.1 },
});
