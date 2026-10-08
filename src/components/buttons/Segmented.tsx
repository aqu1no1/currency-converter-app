import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FONTS, RADIUS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

export type SegmentedOption<Value extends string = string> = {
  /** Texto visível da opção. */
  label: string;
  /** Valor estável retornado ao selecionar a opção. */
  value: Value;
};

/** Propriedades do seletor segmentado. */
type SegmentedProps<Value extends string> = {
  /** Opções disponíveis. */
  options: readonly SegmentedOption<Value>[];
  /** Valor atualmente selecionado. */
  value: Value;
  /** Callback para nova seleção. */
  onChange: (value: Value) => void;
  /** Nome acessível do grupo. */
  accessibilityLabel: string;
};

/**
 * Seletor segmentado com alvos tocáveis de pelo menos 44 px.
 *
 * @example
 * ```tsx
 * <Segmented options={periods} value={period} onChange={setPeriod} accessibilityLabel={t('history.period')} />
 * ```
 */
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
