import { StyleSheet, Text, View } from 'react-native';

import { FONTS, RADIUS, SIZES } from '@constants/theme';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { getCurrencySymbol, getCurrencySymbolSize } from '@utils/currency.util';
import { useTheme } from '@theme/ThemeProvider';

type CurrencyBadgeProps = {
  code: CurrencyCodeValue;

  tone?: 'default' | 'accent';
};
/**
 * [EN] Shows a currency symbol inside a compact 40-by-40 badge.
 * [PT-BR] Mostra o símbolo da moeda em um selo compacto de 40 por 40.
 *
 * @example
 * ```tsx
 * <CurrencyBadge code="USD" />
 * <CurrencyBadge code="BRL" tone="accent" />
 * ```
 */

export function CurrencyBadge({ code, tone = 'default' }: CurrencyBadgeProps) {
  const { colors, dark } = useTheme();
  const symbol = getCurrencySymbol(code);
  const accent = tone === 'accent';
  const symbolColor = accent ? colors.textOnAccent : dark ? colors.accent : colors.primary;

  return (
    <View
      accessible
      accessibilityLabel={`${code} ${symbol}`}
      style={[styles.badge, { backgroundColor: accent ? colors.accent : colors.accentSoft }]}
    >
      <Text style={[styles.symbol, { color: symbolColor, fontSize: getCurrencySymbolSize(code) }]}>
        {symbol}
      </Text>
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
  symbol: { fontFamily: FONTS.display },
});
