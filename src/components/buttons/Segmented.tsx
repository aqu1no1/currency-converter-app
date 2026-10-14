import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FONTS, RADIUS, SIZES } from '@constants/theme';
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

/**
 * [EN] Renders a single-choice segmented control inside a soft track.
 * [PT-BR] Renderiza um seletor segmentado de escolha única dentro de um trilho suave.
 *
 * @example
 * ```tsx
 * <Segmented options={LANGUAGE_OPTIONS} value={language} onChange={setLanguage} accessibilityLabel={t('settings.language')} />
 * ```
 */
export function Segmented<Value extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SegmentedProps<Value>) {
  const { colors } = useTheme();

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={[styles.track, { backgroundColor: colors.surfaceTrack }]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.option,
              selected && { backgroundColor: colors.surfacePrimary },
              pressed && styles.pressed,
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                { color: selected ? colors.textHeading : colors.textSecondary },
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
  track: { flexDirection: 'row', padding: 4, gap: 4, borderRadius: RADIUS.button },
  option: {
    minHeight: SIZES.touchTarget,
    flex: 1,
    paddingHorizontal: 8,
    borderRadius: RADIUS.option,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { transform: [{ scale: 0.97 }] },
  label: { fontFamily: FONTS.bodySemiBold, fontSize: 14 },
});
