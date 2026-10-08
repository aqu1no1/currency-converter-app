import { StyleSheet, Text, View } from 'react-native';

import { CurrencyBadge } from '@components/currency/CurrencyBadge';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { FONTS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

type OnboardingRateRowProps = {
  /** Código ISO da moeda convertida. */
  code: CurrencyCodeValue;
  /** Valor convertido já formatado no idioma ativo. */
  value: string;
};

/**
 * Example currency conversion row shown on the first onboarding step.
 *
 * @example
 * ```tsx
 * <OnboardingRateRow code="EUR" value={formatMoney(amount, 'EUR')} />
 * ```
 */
export function OnboardingRateRow({ code, value }: OnboardingRateRowProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: colors.surfaceBrandOverlay }]}>
      <CurrencyBadge code={code} />
      <Text style={[styles.code, { color: colors.textOnBrand }]}>{code}</Text>
      <Text style={[styles.value, { color: colors.textOnBrand }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.itemGap,
    borderRadius: 16,
  },
  code: { flex: 1, fontFamily: FONTS.bodySemiBold, fontSize: TYPE.body },
  value: { fontFamily: FONTS.displayMedium, fontSize: TYPE.value, fontVariant: ['tabular-nums'] },
});
