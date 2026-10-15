import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { Segmented } from '@components/buttons/Segmented';
import { DarkCard } from '@components/cards/DarkCard';
import { HistoryChart } from '@components/charts/HistoryChart';
import { CurrencyBadge } from '@components/currency/CurrencyBadge';
import { ErrorState } from '@components/feedback/ErrorState';
import { LoadingState } from '@components/feedback/LoadingState';
import { Pill } from '@components/feedback/Pill';
import { HistoryEmpty } from '@components/history/HistoryEmpty';
import { HistorySummary } from '@components/history/HistorySummary';
import { PairSelector } from '@components/history/PairSelector';
import { Screen } from '@components/layout/Screen';
import { ScreenHeader } from '@components/layout/ScreenHeader';
import { SelectModal, type SelectOption } from '@components/select/SelectModal';
import { DISPLAY_CURRENCY_ORDER } from '@constants/currencies.constants';
import { HISTORY_START_DATE } from '@constants/sync.constants';
import { FONTS, SIZES, TAB_SCREEN_EDGES, TYPE } from '@constants/theme';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { useHistory } from '@hooks/useHistory';
import { useOnline } from '@hooks/useOnline';
import { useReduceMotion } from '@hooks/useReduceMotion';
import { getMissingDataKind } from '@utils/api-error.util';
import { isCurrencyCode } from '@utils/currency.util';
import { formatConversionRate, formatDate, formatPercent } from '@utils/format.util';
import {
  historyRange,
  type HistoryPeriod,
  sampleHistory,
  summarizeHistory,
} from '@utils/history.util';
import { useTheme } from '@theme/ThemeProvider';

const CHART_POINTS = 52;
const CHART_HEIGHT = 160;
const PERIODS: readonly HistoryPeriod[] = ['week', 'month', 'year'];

type Picker = 'from' | 'to';

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { setParams, navigate } = useRouter();
  const params = useLocalSearchParams<{ from?: string; to?: string }>();
  const { width: screenWidth } = useWindowDimensions();

  const reduceMotion = useReduceMotion();

  const [period, setPeriod] = useState<HistoryPeriod>('month');
  const [picker, setPicker] = useState<Picker | null>(null);

  const from: CurrencyCodeValue = params.from && isCurrencyCode(params.from) ? params.from : 'USD';
  const to: CurrencyCodeValue = params.to && isCurrencyCode(params.to) ? params.to : 'BRL';
  const history = useHistory({ from, to, ...historyRange(period) });
  const online = useOnline();
  const errorKind = history.data ? undefined : getMissingDataKind(online, history);

  const points = history.data ? sampleHistory(history.data.history, CHART_POINTS) : [];
  const summary = history.data ? summarizeHistory(history.data.history) : undefined;
  const periodLong = t(`history.periodsLong.${period}`);
  const periodOptions = PERIODS.map((value) => ({ value, label: t(`history.periods.${value}`) }));
  const currencyOptions: SelectOption<CurrencyCodeValue>[] = DISPLAY_CURRENCY_ORDER.map((code) => ({
    value: code,
    label: code,
    description: t(`currencies.${code}` as const),
    leading: <CurrencyBadge code={code} />,
  }));

  const setPair = (nextFrom: CurrencyCodeValue, nextTo: CurrencyCodeValue) => {
    setParams({ from: nextFrom, to: nextTo });
  };

  const swap = () => setPair(to, from);

  const selectCurrency = (code: CurrencyCodeValue) => {
    if (picker === 'from') {
      if (code === to) setPair(to, from);
      else setPair(code, to);
    }
    if (picker === 'to') {
      if (code === from) setPair(to, from);
      else setPair(from, code);
    }
  };

  const renderPeriods = () => (
    <Segmented
      tone="onBrand"
      options={periodOptions}
      value={period}
      onChange={setPeriod}
      accessibilityLabel={t('history.periodLabel')}
    />
  );

  const renderCard = () => {
    if (!summary) {
      return (
        <DarkCard style={styles.card}>
          <Text style={[styles.caption, { color: colors.textOnBrandMuted }]}>
            {t('history.emptyPair', { from, to, period: t(`history.periods.${period}`) })}
          </Text>
          <HistoryEmpty title={t('history.emptyTitle')} message={t('history.emptyBody')} />
          {renderPeriods()}
        </DarkCard>
      );
    }

    const up = summary.change >= 0;
    const value = formatPercent(Math.abs(summary.change));

    return (
      <DarkCard style={styles.card}>
        <View style={styles.heading}>
          <Text style={[styles.caption, { color: colors.textOnBrandMuted }]}>
            {t('history.pair', { from, to })}
          </Text>
          <Text style={[styles.rate, { color: colors.white }]}>
            {formatConversionRate(summary.last.rate)}
          </Text>
          <View
            accessible
            accessibilityLabel={t(up ? 'history.variationUp' : 'history.variationDown', {
              value,
              period: periodLong,
            })}
          >
            <Pill
              label={t('history.variation', {
                direction: up ? '▲' : '▼',
                value,
                period: periodLong,
              })}
              tone={up ? 'onBrandSolid' : 'warning'}
            />
          </View>
        </View>
        <HistoryChart
          data={points}
          currency={to}
          height={CHART_HEIGHT}
          interactive={false}
          animated={reduceMotion === false}
          showAxes={false}
          fitData
          curved={false}
          thickness={2.5}
          fillOpacity={0.16}
          highlightLast
          width={screenWidth - SIZES.screenPadding * 2 - SIZES.cardPadding * 2}
          accessibilityLabel={t('history.chartLabel', { from, to, period: periodLong })}
        />
        <View style={styles.dates}>
          <Text style={[styles.date, { color: colors.textOnBrandMuted }]}>
            {formatDate(summary.first.date)}
          </Text>
          <Text style={[styles.date, { color: colors.textOnBrandMuted }]}>
            {formatDate(summary.last.date)}
          </Text>
        </View>
        {renderPeriods()}
      </DarkCard>
    );
  };

  const renderContent = () => {
    if (errorKind) {
      return (
        <ErrorState
          kind={errorKind}
          onRetry={() => void history.refetch()}
          onOpenSyncStatus={() => navigate('/settings')}
        />
      );
    }
    if (!history.data) return <LoadingState />;

    return (
      <>
        {renderCard()}
        {summary ? (
          <HistorySummary
            title={t('history.summary')}
            items={[
              {
                label: t('history.start'),
                value: formatConversionRate(summary.first.rate),
                date: formatDate(summary.first.date),
              },
              {
                label: t('history.latest'),
                value: formatConversionRate(summary.last.rate),
                date: formatDate(summary.last.date),
              },
              {
                label: t('history.minimum'),
                value: formatConversionRate(summary.min.rate),
                date: formatDate(summary.min.date),
              },
              {
                label: t('history.maximum'),
                value: formatConversionRate(summary.max.rate),
                date: formatDate(summary.max.date),
              },
            ]}
          />
        ) : null}
      </>
    );
  };

  return (
    <Screen edges={TAB_SCREEN_EDGES}>
      <ScreenHeader
        title={t('history.title')}
        context={t('history.since', { date: formatDate(HISTORY_START_DATE) })}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PairSelector
          from={from}
          to={to}
          onPressFrom={() => setPicker('from')}
          onPressTo={() => setPicker('to')}
          onSwap={swap}
        />
        {renderContent()}
      </ScrollView>
      <SelectModal
        visible={picker !== null}
        title={t(picker === 'to' ? 'history.pickTo' : 'history.pickFrom')}
        options={currencyOptions}
        value={picker === 'to' ? to : from}
        onSelect={selectCurrency}
        onClose={() => setPicker(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { gap: SIZES.sectionGap, paddingBottom: SIZES.sectionGap },
  card: { gap: SIZES.itemGap },
  heading: { gap: 8 },
  caption: {
    fontFamily: FONTS.body,
    fontSize: TYPE.secondary,
    lineHeight: TYPE.secondary * 1.35,
  },
  rate: {
    fontFamily: FONTS.display,
    fontSize: TYPE.display,
    lineHeight: TYPE.display * 1.05,
    fontVariant: ['tabular-nums'],
  },
  dates: { flexDirection: 'row', justifyContent: 'space-between' },
  date: { fontFamily: FONTS.body, fontSize: TYPE.caption, lineHeight: TYPE.caption * 1.35 },
});
