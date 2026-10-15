import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@components/icons/Icon';
import type { IconName } from '@constants/icons';
import { FONTS, RADIUS, SIZES } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

export type SegmentedOption<Value extends string = string> = {
  label: string;

  value: Value;

  icon?: IconName;
};

interface SegmentedProps<Value extends string> {
  /** Opções exibidas lado a lado, cada uma com rótulo, valor e ícone opcional. */
  options: readonly SegmentedOption<Value>[];
  /** Valor da opção marcada. */
  value: Value;
  /** Chamado com o valor da opção tocada. */
  onChange: (value: Value) => void;
  /** Nome do grupo lido pelo leitor de tela. */
  accessibilityLabel: string;
  /**
   * `onBrand` usa trilho translúcido e opção marcada em verde-menta, para o card escuro.
   * `solid` usa o fundo da página e a opção marcada em verde escuro (menta no tema escuro).
   */
  tone?: 'default' | 'onBrand' | 'solid';
}

/**
 * Seletor de escolha única com as opções lado a lado dentro de um trilho.
 *
 * A opção marcada fica com fundo da superfície; as outras ficam com texto
 * secundário sobre o trilho. Usado para idioma, com `tone="onBrand"` para os
 * períodos dentro do card escuro do Histórico e com `tone="solid"` para o tema em
 * Ajustes.
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
  const { colors, dark } = useTheme();
  const palette = {
    default: {
      track: colors.surfaceTrack,
      selected: colors.surfacePrimary,
      selectedText: colors.textHeading,
      text: colors.textSecondary,
    },
    onBrand: {
      track: colors.surfaceBrandOverlay,
      selected: colors.accent,
      selectedText: colors.textOnAccent,
      text: colors.textOnBrandMuted,
    },
    solid: {
      track: colors.background,
      selected: dark ? colors.accent : colors.primary,
      selectedText: dark ? colors.textOnAccent : colors.white,
      text: colors.textSecondary,
    },
  }[tone];

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={[styles.track, { backgroundColor: palette.track }]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const textColor = selected ? palette.selectedText : palette.text;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ selected, checked: selected }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.option,
              selected && { backgroundColor: palette.selected },
              pressed && styles.pressed,
            ]}
          >
            {option.icon ? <Icon name={option.icon} size={18} color={textColor} /> : null}
            <Text numberOfLines={1} style={[styles.label, { color: textColor }]}>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  pressed: { transform: [{ scale: 0.97 }] },
  label: { fontFamily: FONTS.bodySemiBold, fontSize: 14 },
});
