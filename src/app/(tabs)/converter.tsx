import { FlashList } from '@shopify/flash-list';
import type Decimal from 'decimal.js';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ConverterAmountCard } from '@components/converter/ConverterAmountCard';
import { Keypad } from '@components/converter/Keypad';
import { CurrencyBadge } from '@components/currency/CurrencyBadge';
import { ErrorState } from '@components/feedback/ErrorState';
import { LoadingState } from '@components/feedback/LoadingState';
import { Screen } from '@components/layout/Screen';
import { ScreenHeader } from '@components/layout/ScreenHeader';
import { ListRow } from '@components/list/ListRow';
import { DISPLAY_CURRENCY_ORDER } from '@constants/currencies.constants';
import { RADIUS, SIZES, TAB_SCREEN_EDGES } from '@constants/theme';
import { usePreferences } from '@contexts/PreferencesContext';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { useConverter } from '@hooks/useConverter';
import { useLatestRates } from '@hooks/useLatestRates';
import { convertAmount } from '@utils/converter.util';
import { getCurrencySymbol } from '@utils/currency.util';
import {
  formatAmountInput,
  formatConversionRate,
  formatDate,
  formatMoney,
} from '@utils/format.util';
import { useTheme } from '@theme/ThemeProvider';

const ROW_GAP = 8;

type ConversionRow = {
  code: CurrencyCodeValue;
  rate: number;
  value: Decimal;
};

export default function Converter() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { primaryCurrency } = usePreferences();

  const { base, amount, pressKey, convertFrom } = useConverter(primaryCurrency);
  const latest = useLatestRates(base);

  const rates = latest.data?.base === base ? latest.data.rates : undefined;
  const rows: ConversionRow[] = rates
    ? DISPLAY_CURRENCY_ORDER.flatMap((code) => {
        const rate = rates[code];
        if (code === base || rate === undefined) return [];
        return [{ code, rate, value: convertAmount(amount, rate, code) }];
      })
    : [];

  const RowSeparator = () => <View style={styles.separator} />;

  const renderList = () => {
    if (latest.isError) {
      return <ErrorState error={latest.error} onRetry={() => void latest.refetch()} />;
    }
    if (!rates) return <LoadingState />;

    return (
      <FlashList
        data={rows}
        keyExtractor={(row) => row.code}
        extraData={amount}
        accessibilityLabel={t('converter.listLabel')}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={RowSeparator}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const value = formatMoney(item.value.toNumber(), item.code);

          return (
            <ListRow
              leading={<CurrencyBadge code={item.code} />}
              title={item.code}
              subtitle={t('converter.rateLine', {
                from: base,
                rate: formatConversionRate(item.rate),
                to: item.code,
              })}
              value={value}
              accessibilityLabel={t('converter.rowLabel', {
                name: t(`currencies.${item.code}` as const),
                value,
                code: item.code,
              })}
              onPress={() => convertFrom(item.code, item.value)}
              style={[
                styles.row,
                { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
              ]}
            />
          );
        }}
      />
    );
  };

  return (
    <Screen edges={TAB_SCREEN_EDGES}>
      <ScreenHeader
        title={t('tabs.converter')}
        context={
          rates && latest.data
            ? t('converter.quoteDate', { date: formatDate(latest.data.date) })
            : undefined
        }
      />
      <ConverterAmountCard
        code={base}
        name={t(`currencies.${base}` as const)}
        amount={`${getCurrencySymbol(base)} ${formatAmountInput(amount)}`}
        hint={t('converter.hint')}
        accessibilityLabel={t('converter.amountLabel')}
      />
      <View style={styles.list}>{renderList()}</View>
      <Keypad onPress={pressKey} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, paddingTop: SIZES.itemGap },
  listContent: { paddingBottom: ROW_GAP },
  separator: { height: ROW_GAP },
  row: { borderWidth: 1, borderRadius: RADIUS.button },
});
