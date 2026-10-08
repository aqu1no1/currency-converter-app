import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { FONTS, RADIUS, TYPE } from '@constants/theme';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { getCurrencySymbol } from '@utils/currency.util';
import { useTheme } from '@theme/ThemeProvider';

type CurrencyOptionProps = {
  /** Código ISO da moeda. */
  code: CurrencyCodeValue;
  /** Nome da moeda traduzido. */
  label: string;
  /** Define se a opção aparece selecionada. */
  selected: boolean;
  /** Largura da célula para a grade de cinco colunas. */
  width: number;
  /** Espaçamento opcional depois da célula. */
  style?: StyleProp<ViewStyle>;
  /** Atualiza a moeda principal selecionada. */
  onSelect: (code: CurrencyCodeValue) => void;
};

/**
 * Selectable currency tile used by the preference step.
 *
 * @example
 * ```tsx
 * <CurrencyOption code="EUR" label={t('currencies.EUR')} selected={currency === 'EUR'} onSelect={setCurrency} />
 * ```
 */
export function CurrencyOption({
  code,
  label,
  selected,
  width,
  style,
  onSelect,
}: CurrencyOptionProps) {
  const { colors, dark } = useTheme();
  const selectedBackground = dark ? colors.accent : colors.primary;
  const selectedForeground = dark ? colors.textOnAccent : colors.white;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={`${label} (${code})`}
      accessibilityState={{ checked: selected, selected }}
      onPress={() => onSelect(code)}
      style={[
        styles.option,
        { width },
        style,
        {
          backgroundColor: selected ? selectedBackground : colors.surfacePrimary,
          borderColor: selected ? selectedBackground : colors.border,
        },
      ]}
    >
      <Text style={[styles.symbol, { color: selected ? selectedForeground : colors.primary }]}>
        {getCurrencySymbol(code)}
      </Text>
      <Text style={[styles.code, { color: selected ? selectedForeground : colors.textSecondary }]}>
        {code}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    minHeight: 64,
    borderWidth: 1,
    borderRadius: RADIUS.button,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  symbol: { fontFamily: FONTS.display, fontSize: TYPE.body },
  code: { fontFamily: FONTS.bodySemiBold, fontSize: TYPE.caption },
});
