import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

import { SIZES } from '@constants/theme';
import { SUPPORTED_CURRENCIES } from '@constants/currencies.constants';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { CurrencyOption } from '@components/onboarding/CurrencyOption';

type CurrencyGridProps = {
  selectedCurrency: CurrencyCodeValue;
  onSelectCurrency: (currency: CurrencyCodeValue) => void;
  accessibilityLabel: string;
};

const CURRENCY_CODES = SUPPORTED_CURRENCIES as readonly CurrencyCodeValue[];
const CURRENCY_COLUMNS = 5;

/**
 * Two-row, five-column currency selector backed by FlashList.
 *
 * @example
 * ```tsx
 * <CurrencyGrid selectedCurrency={primaryCurrency} onSelectCurrency={setPrimaryCurrency} accessibilityLabel={t('settings.primaryCurrency')} />
 * ```
 */
export function CurrencyGrid({
  selectedCurrency,
  onSelectCurrency,
  accessibilityLabel,
}: CurrencyGridProps) {
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const listWidth = screenWidth - SIZES.screenPadding * 2;
  const optionWidth = (listWidth - SIZES.itemGap * (CURRENCY_COLUMNS - 1)) / CURRENCY_COLUMNS;
  const renderOption = ({ item: code, index }: ListRenderItemInfo<CurrencyCodeValue>) => (
    <CurrencyOption
      code={code}
      label={t(`currencies.${code}` as const)}
      selected={selectedCurrency === code}
      width={optionWidth}
      style={{ marginRight: index === CURRENCY_COLUMNS - 1 ? 0 : SIZES.itemGap }}
      onSelect={onSelectCurrency}
    />
  );

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={styles.grid}
    >
      <FlashList
        horizontal
        data={CURRENCY_CODES.slice(0, CURRENCY_COLUMNS)}
        keyExtractor={(code) => code}
        renderItem={renderOption}
        style={{ width: listWidth, height: 64 }}
        showsHorizontalScrollIndicator={false}
      />
      <FlashList
        horizontal
        data={CURRENCY_CODES.slice(CURRENCY_COLUMNS)}
        keyExtractor={(code) => code}
        renderItem={renderOption}
        style={{ width: listWidth, height: 64 }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({ grid: { gap: 8, alignItems: 'center' } });
