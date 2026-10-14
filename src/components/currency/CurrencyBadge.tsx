import { StyleSheet, Text, View } from 'react-native';

import { FONTS, RADIUS, SIZES } from '@constants/theme';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { getCurrencySymbol, getCurrencySymbolSize } from '@utils/currency.util';
import { useTheme } from '@theme/ThemeProvider';

type CurrencyBadgeProps = {
  code: CurrencyCodeValue;
};
/**
 * [EN] Shows a currency symbol inside a compact 40-by-40 badge.
 * [PT-BR] Mostra o símbolo da moeda em um selo compacto de 40 por 40.
 *
 * @example
 * ```tsx
 * <CurrencyBadge code="USD" />
 * ```
 */

export function CurrencyBadge({ code }: CurrencyBadgeProps) {
  const { colors, dark } = useTheme();
  const symbol = getCurrencySymbol(code);

  return (
    <View
      accessible
      accessibilityLabel={`${code} ${symbol}`}
      style={[styles.badge, { backgroundColor: colors.accentSoft }]}
    >
      <Text
        style={[
          styles.symbol,
          { color: dark ? colors.accent : colors.primary, fontSize: getCurrencySymbolSize(code) },
        ]}
      >
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
