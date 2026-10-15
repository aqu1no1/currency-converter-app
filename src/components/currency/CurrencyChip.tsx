import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FONTS, RADIUS, SIZES } from '@constants/theme';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { getCurrencySymbol, getCurrencySymbolSize } from '@utils/currency.util';
import { useTheme } from '@theme/ThemeProvider';

const SYMBOL_SIZE = 34;

interface CurrencyChipProps {
  /** Moeda do chip. */
  code: CurrencyCodeValue;
  /** Nome traduzido da moeda, lido pelo leitor de tela. */
  label: string;
  /** Se o chip está marcado. */
  selected: boolean;
  /** Chamado com a moeda ao tocar. */
  onSelect: (code: CurrencyCodeValue) => void;
}

/**
 * Chip em formato de pílula com o símbolo da moeda num círculo e o código ao lado.
 *
 * Marcado, fica com fundo verde escuro (verde-menta no tema escuro) e o círculo em
 * verde-menta. Usado na faixa de moedas-base das Cotações.
 *
 * @example
 * ```tsx
 * <CurrencyChip code="EUR" label={t('currencies.EUR')} selected={base === 'EUR'} onSelect={setBase} />
 * ```
 */
export function CurrencyChip({ code, label, selected, onSelect }: CurrencyChipProps) {
  const { colors, dark } = useTheme();
  const selectedBackground = dark ? colors.accent : colors.primary;
  const selectedForeground = dark ? colors.textOnAccent : colors.white;
  const circleBackground = selected ? (dark ? colors.primary : colors.accent) : colors.accentSoft;
  const symbolColor = dark ? colors.accent : selected ? colors.textOnAccent : colors.primary;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={`${label} (${code})`}
      accessibilityState={{ checked: selected, selected }}
      onPress={() => onSelect(code)}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? selectedBackground : colors.surfacePrimary,
          borderColor: selected ? selectedBackground : colors.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.symbolCircle, { backgroundColor: circleBackground }]}>
        <Text
          style={[styles.symbol, { color: symbolColor, fontSize: getCurrencySymbolSize(code) }]}
        >
          {getCurrencySymbol(code)}
        </Text>
      </View>
      <Text style={[styles.code, { color: selected ? selectedForeground : colors.textHeading }]}>
        {code}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: SIZES.touchTarget,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 14,
    borderWidth: 1,
    borderRadius: RADIUS.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pressed: { transform: [{ scale: 0.97 }] },
  symbolCircle: {
    width: SYMBOL_SIZE,
    height: SYMBOL_SIZE,
    borderRadius: SYMBOL_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: { fontFamily: FONTS.display },
  code: { fontFamily: FONTS.bodySemiBold, fontSize: 15 },
});
