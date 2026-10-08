import { StyleSheet, Text, View } from 'react-native';

import { FONTS, RADIUS, SIZES, TYPE } from '@constants/theme';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { useTheme } from '@theme/ThemeProvider';

const SYMBOLS: Record<CurrencyCodeValue, string> = {
  USD: '$',
  BRL: 'R$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: '$',
  AUD: '$',
  CHF: 'Fr',
  CNY: '元',
  ARS: '$',
};

/** Propriedades do selo visual de moeda. */
type CurrencyBadgeProps = {
  /** Código ISO da moeda. */
  code: CurrencyCodeValue;
};

/**
 * Mostra o símbolo de uma moeda em um bloco de 40×40.
 *
 * @example
 * ```tsx
 * <CurrencyBadge code="USD" />
 * ```
 */
export function CurrencyBadge({ code }: CurrencyBadgeProps) {
  const { colors } = useTheme();

  return (
    <View
      accessible
      accessibilityLabel={`${code} ${SYMBOLS[code]}`}
      style={[styles.badge, { backgroundColor: colors.accentSoft }]}
    >
      <Text style={[styles.symbol, { color: colors.primary }]}>{SYMBOLS[code]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: SIZES.currencyIcon,
    height: SIZES.currencyIcon,
    borderRadius: RADIUS.icon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: { fontFamily: FONTS.display, fontSize: TYPE.body },
});
