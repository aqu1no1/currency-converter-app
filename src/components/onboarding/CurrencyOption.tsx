import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { FONTS, RADIUS, TYPE } from '@constants/theme';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { getCurrencySymbol, getCurrencySymbolSize } from '@utils/currency.util';
import { useTheme } from '@theme/ThemeProvider';

type CurrencyOptionProps = {
  code: CurrencyCodeValue;

  label: string;

  selected: boolean;

  width: number;

  style?: StyleProp<ViewStyle>;

  onSelect: (code: CurrencyCodeValue) => void;
};
/**
 * [EN] Renders one selectable currency option in the onboarding grid.
 * [PT-BR] Renderiza uma opção de moeda selecionável na grade do onboarding.
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
      <Text
        style={[
          styles.symbol,
          {
            color: selected ? selectedForeground : colors.textHeading,
            fontSize: getCurrencySymbolSize(code),
          },
        ]}
      >
        {getCurrencySymbol(code)}
      </Text>
      <Text style={[styles.code, { color: selected ? selectedForeground : colors.textHeading }]}>
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
  symbol: { fontFamily: FONTS.display },
  code: { fontFamily: FONTS.bodySemiBold, fontSize: TYPE.caption },
});
