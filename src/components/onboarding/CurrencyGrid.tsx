import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DISPLAY_CURRENCY_ORDER } from '@constants/currencies.constants';
import { SIZES } from '@constants/theme';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { CurrencyOption } from '@components/onboarding/CurrencyOption';

type CurrencyGridProps = {
  selectedCurrency: CurrencyCodeValue;
  onSelectCurrency: (currency: CurrencyCodeValue) => void;
  accessibilityLabel: string;
};

const CURRENCY_CODES = DISPLAY_CURRENCY_ORDER;
const CURRENCY_COLUMNS = 5;
const CURRENCY_GAP = 8;
/**
 * [EN] Renders the supported currencies as a two-row, five-column selector.
 * [PT-BR] Renderiza as moedas disponíveis em um seletor de duas linhas e cinco colunas.
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
  const optionWidth = (listWidth - CURRENCY_GAP * (CURRENCY_COLUMNS - 1)) / CURRENCY_COLUMNS;
  const renderOption = ({ item: code, index }: ListRenderItemInfo<CurrencyCodeValue>) => (
    <CurrencyOption
      code={code}
      label={t(`currencies.${code}` as const)}
      selected={selectedCurrency === code}
      width={optionWidth}
      style={{ marginRight: index === CURRENCY_COLUMNS - 1 ? 0 : CURRENCY_GAP }}
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
