import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FONTS, RADIUS, SIZES } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

export type SegmentedOption<Value extends string = string> = {
  label: string;

  value: Value;
};

interface SegmentedProps<Value extends string> {
  /** Opções exibidas lado a lado, cada uma com rótulo e valor. */
  options: readonly SegmentedOption<Value>[];
  /** Valor da opção marcada. */
  value: Value;
  /** Chamado com o valor da opção tocada. */
  onChange: (value: Value) => void;
  /** Nome do grupo lido pelo leitor de tela. */
  accessibilityLabel: string;
  /** `onBrand` usa trilho translúcido e opção marcada em verde-menta, para o card escuro. */
  tone?: 'default' | 'onBrand';
}

/**
 * Seletor de escolha única com as opções lado a lado dentro de um trilho.
 *
 * A opção marcada fica com fundo da superfície; as outras ficam com texto
 * secundário sobre o trilho. Usado para idioma e, com `tone="onBrand"`, para os
 * períodos dentro do card escuro do Histórico.
 *
 * @example
 * ```tsx
 * <Segmented
 *   options={LANGUAGE_OPTIONS}
 *   value={language}
 *   onChange={setLanguage}
 *   accessibilityLabel={t('onboarding.language')}
 * />
 * ```
 */
export function Segmented<Value extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
  tone = 'default',
}: SegmentedProps<Value>) {
  const { colors } = useTheme();
  const onBrand = tone === 'onBrand';
  const palette = onBrand
    ? {
        track: colors.surfaceBrandOverlay,
        selected: colors.accent,
        selectedText: colors.textOnAccent,
        text: colors.textOnBrandMuted,
      }
    : {
        track: colors.surfaceTrack,
        selected: colors.surfacePrimary,
        selectedText: colors.textHeading,
        text: colors.textSecondary,
      };

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={[styles.track, { backgroundColor: palette.track }]}
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
              selected && { backgroundColor: palette.selected },
              pressed && styles.pressed,
            ]}
          >
            <Text
              numberOfLines={1}
              style={[styles.label, { color: selected ? palette.selectedText : palette.text }]}
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
