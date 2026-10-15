import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CurrencyBadge } from '@components/currency/CurrencyBadge';
import { CurrencyChip } from '@components/currency/CurrencyChip';
import { ErrorState } from '@components/feedback/ErrorState';
import { LoadingState } from '@components/feedback/LoadingState';
import { Screen } from '@components/layout/Screen';
import { ScreenHeader } from '@components/layout/ScreenHeader';
import { ListRow } from '@components/list/ListRow';
import { DISPLAY_CURRENCY_ORDER } from '@constants/currencies.constants';
import { FONTS, RADIUS, SIZES, TAB_SCREEN_EDGES, TYPE } from '@constants/theme';
import { usePreferences } from '@contexts/PreferencesContext';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { useLatestRates } from '@hooks/useLatestRates';
import { formatConversionRate, formatDate } from '@utils/format.util';
import { useTheme } from '@theme/ThemeProvider';

const CHIP_GAP = 8;

type RateRow = {
  code: CurrencyCodeValue;
  rate: number;
  inverse: number;
};

export default function RatesScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { navigate } = useRouter();
  const { primaryCurrency } = usePreferences();

  const [base, setBase] = useState<CurrencyCodeValue>(primaryCurrency);
  const latest = useLatestRates(base);

  const rates = latest.data?.base === base ? latest.data.rates : undefined;
  const rows: RateRow[] = rates
    ? DISPLAY_CURRENCY_ORDER.flatMap((code) => {
        const rate = rates[code];
        if (code === base || rate === undefined) return [];
        return [{ code, rate, inverse: 1 / rate }];
      })
    : [];

  const openHistory = (code: CurrencyCodeValue) => {
    navigate({ pathname: '/history', params: { from: base, to: code } });
  };

  const renderBases = () => (
    <View style={styles.bases}>
      <Text style={[styles.baseLabel, { color: colors.textSecondary }]}>
        {t('rates.baseLabel', { base })}
      </Text>
      <ScrollView
        horizontal
        accessibilityRole="radiogroup"
        accessibilityLabel={t('rates.basesLabel')}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.basesContent}
      >
        {DISPLAY_CURRENCY_ORDER.map((code) => (
          <CurrencyChip
            key={code}
            code={code}
            label={t(`currencies.${code}` as const)}
            selected={code === base}
            onSelect={setBase}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderList = () => {
    if (latest.isError) {
      return (
        <View style={styles.state}>
          <ErrorState error={latest.error} onRetry={() => void latest.refetch()} />
        </View>
      );
    }
    if (!rates) {
      return (
        <View style={styles.state}>
          <LoadingState />
        </View>
      );
    }

    return (
      <FlashList
        data={rows}
        keyExtractor={(row) => row.code}
        extraData={base}
        accessibilityLabel={t('rates.listLabel')}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={latest.isRefetching}
            onRefresh={() => void latest.refetch()}
            tintColor={colors.highlight}
          />
        }
        ListFooterComponent={
          <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>
            {t('rates.disclaimer')}
          </Text>
        }
        renderItem={({ item, index }) => {
          const rate = formatConversionRate(item.rate);

          return (
            <ListRow
              leading={<CurrencyBadge code={item.code} />}
              title={item.code}
              subtitle={t(`currencies.${item.code}` as const)}
              value={rate}
              valueCaption={t('rates.inverseLine', {
                code: item.code,
                rate: formatConversionRate(item.inverse),
                base,
              })}
              accessibilityLabel={t('rates.rowLabel', {
                name: t(`currencies.${item.code}` as const),
                base,
                rate,
                code: item.code,
              })}
              onPress={() => openHistory(item.code)}
              style={[
                styles.row,
                { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
                index === 0 ? styles.firstRow : { borderTopColor: colors.divider },
                index === rows.length - 1 && styles.lastRow,
              ]}
            />
          );
        }}
      />
    );
  };

  return (
    <Screen edges={TAB_SCREEN_EDGES} contentStyle={styles.screen}>
      <View style={styles.header}>
        <ScreenHeader
          title={t('rates.title')}
          context={
            rates && latest.data
              ? t('rates.quoteDate', { date: formatDate(latest.data.date) })
              : undefined
          }
        />
      </View>
      {renderBases()}
      <View style={styles.list}>{renderList()}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 0 },
  header: { paddingHorizontal: SIZES.screenPadding },
  bases: { paddingBottom: SIZES.cardPadding, gap: CHIP_GAP },
  baseLabel: {
    paddingHorizontal: SIZES.screenPadding,
    fontFamily: FONTS.body,
    fontSize: TYPE.secondary,
    lineHeight: TYPE.secondary * 1.35,
  },
  basesContent: { paddingHorizontal: SIZES.screenPadding, gap: CHIP_GAP },
  list: { flex: 1 },
  state: { flex: 1, paddingHorizontal: SIZES.screenPadding },
  listContent: { paddingHorizontal: SIZES.screenPadding, paddingBottom: SIZES.sectionGap },
  row: { borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1 },
  firstRow: { borderTopLeftRadius: RADIUS.list, borderTopRightRadius: RADIUS.list },
  lastRow: {
    borderBottomWidth: 1,
    borderBottomLeftRadius: RADIUS.list,
    borderBottomRightRadius: RADIUS.list,
  },
  disclaimer: {
    marginTop: SIZES.itemGap,
    fontFamily: FONTS.body,
    fontSize: TYPE.caption,
    lineHeight: TYPE.caption * 1.35,
  },
});
