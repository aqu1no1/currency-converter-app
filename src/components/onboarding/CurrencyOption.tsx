import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { FONTS, RADIUS, TYPE } from '@constants/theme';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { getCurrencySymbol, getCurrencySymbolSize } from '@utils/currency.util';
import { useTheme } from '@theme/ThemeProvider';

interface CurrencyOptionProps {
  /** Moeda da opção. */
  code: CurrencyCodeValue;
  /** Nome traduzido da moeda, lido pelo leitor de tela. */
  label: string;
  /** Se a opção está marcada. */
  selected: boolean;
  /** Largura da opção, calculada pela grade. */
  width: number;
  /** Estilo extra, como a margem entre as colunas. */
  style?: StyleProp<ViewStyle>;
  /** Chamado com a moeda ao tocar. */
  onSelect: (code: CurrencyCodeValue) => void;
}

/**
 * Opção da grade de moedas, com o símbolo e o código.
 *
 * Marcada, fica com fundo verde escuro (verde-menta no tema escuro).
 *
 * @example
 * ```tsx
 * <CurrencyOption code="EUR" label={t('currencies.EUR')} selected={currency === 'EUR'} width={64} onSelect={setCurrency} />
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
