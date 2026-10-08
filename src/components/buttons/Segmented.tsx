import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FONTS, RADIUS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

export type SegmentedOption<Value extends string = string> = {
  label: string;
  value: Value;
};

type SegmentedProps<Value extends string> = {
  options: readonly SegmentedOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
  accessibilityLabel: string;
};

export function Segmented<Value extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SegmentedProps<Value>) {
  const { colors, dark } = useTheme();

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[styles.track, { backgroundColor: colors.surfaceAlternate }]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
              selected && {
                backgroundColor: dark ? colors.accent : colors.accentSoft,
                borderColor: colors.accent,
              },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                { color: selected && dark ? colors.textOnAccent : colors.textPrimary },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', padding: 4, gap: 4, borderRadius: RADIUS.pill },
  option: {
    minHeight: SIZES.touchTarget,
    flex: 1,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontFamily: FONTS.bodySemiBold, fontSize: TYPE.secondary },
});
