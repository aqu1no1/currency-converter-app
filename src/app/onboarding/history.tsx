import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { DarkCard } from '@components/cards/DarkCard';
import { HistoryChart, type HistoryPoint } from '@components/charts/HistoryChart';
import { Pill } from '@components/feedback/Pill';
import { OnboardingFooter } from '@components/onboarding/OnboardingFooter';
import { OnboardingHeader } from '@components/onboarding/OnboardingHeader';
import { OnboardingText } from '@components/onboarding/OnboardingText';
import { Screen } from '@components/layout/Screen';
import { APP_ROUTES } from '@constants/routes.constants';
import { FONTS, RADIUS, SIZES, TYPE } from '@constants/theme';
import { TIME_IN_MS } from '@constants/time.constants';
import { useCompleteOnboarding } from '@hooks/useCompleteOnboarding';
import { useHistory } from '@hooks/useHistory';
import { useReduceMotion } from '@hooks/useReduceMotion';
import { formatDate, formatRate } from '@utils/format.util';
import { utcDateAtOffset } from '@utils/date.util';
import { useTheme } from '@theme/ThemeProvider';

const FALLBACK_RATES = [
  5.02, 5.12, 5.08, 5.25, 5.18, 5.31, 5.22, 5.37, 5.28, 5.11, 5.24, 5.08, 5.193,
];
const CHART_POINTS = 52;
const FALLBACK_STEP_DAYS = TIME_IN_MS.MONTH / TIME_IN_MS.DAY;

type SummaryStat = { label: string; value: string };

/**
 * [EN] Introduces exchange-rate history with a chart and summary statistics.
 * [PT-BR] Apresenta o histórico de cotações com gráfico e estatísticas.
 *
 * @example
 * ```tsx
 * <OnboardingHistoryStep />
 * ```
 */

const OnboardingHistoryStep = () => {
  const getFallbackHistory = (): HistoryPoint[] => {
    return FALLBACK_RATES.map((value, index) => {
      const isoDate = utcDateAtOffset(-(FALLBACK_RATES.length - index - 1) * FALLBACK_STEP_DAYS);
      return { value, label: formatDate(isoDate), date: isoDate };
    });
  };

  const getHistoryRange = () => ({
    end: utcDateAtOffset(0),
    start: utcDateAtOffset(-TIME_IN_MS.YEAR / TIME_IN_MS.DAY),
  });

  const sampleHistory = (history: { date: string; rate: number }[]): HistoryPoint[] => {
    if (history.length <= CHART_POINTS) {
      return history.map(({ date, rate }) => ({ value: rate, label: formatDate(date), date }));
    }

    const interval = Math.max(1, Math.floor(history.length / (CHART_POINTS - 1)));
    return history
      .filter((_, index) => index % interval === 0 || index === history.length - 1)
      .map(({ date, rate }) => ({ value: rate, label: formatDate(date), date }));
  };

  const [fallbackHistory] = useState(getFallbackHistory);
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const { navigate } = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const completeOnboarding = useCompleteOnboarding();
  const reduceMotion = useReduceMotion();
  const { start, end } = getHistoryRange();
  const { data } = useHistory({ from: 'USD', to: 'BRL', start, end });
  const allRates = data?.history.length ? data.history.map(({ rate }) => rate) : FALLBACK_RATES;
  const points = data?.history.length ? sampleHistory(data.history) : fallbackHistory;
  const first = allRates[0] ?? FALLBACK_RATES[0]!;
  const latest = allRates.at(-1) ?? FALLBACK_RATES.at(-1)!;
  const change = first === 0 ? 0 : (latest / first - 1) * 100;
  const direction = change >= 0 ? '▲' : '▼';
  const variation = new Intl.NumberFormat(i18n.resolvedLanguage ?? 'pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(change));
  const stats: SummaryStat[] = [
    { label: t('onboarding.minimum'), value: formatRate(Math.min(...allRates)) },
    { label: t('onboarding.maximum'), value: formatRate(Math.max(...allRates)) },
    { label: t('onboarding.since'), value: '2000' },
  ];

  return (
    <Screen contentStyle={styles.screen}>
      <OnboardingHeader step={2} onSkip={() => void completeOnboarding()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <DarkCard style={styles.card}>
          <View style={styles.heroHeading}>
            <Text style={[styles.cardCaption, { color: colors.textOnBrandMuted }]}>
              {t('onboarding.pair')}
            </Text>
            <Pill
              label={t('onboarding.variation', { direction, value: `${variation}%` })}
              tone="onBrandSolid"
            />
          </View>
          <Text style={[styles.rate, { color: colors.white }]}>{formatRate(latest)}</Text>
          <HistoryChart
            data={points}
            currency="BRL"
            height={170}
            interactive={false}
            animated={reduceMotion === false}
            showAxes={false}
            fitData
            curved={false}
            thickness={2.5}
            fillOpacity={0.16}
            highlightLast
            width={screenWidth - SIZES.screenPadding * 2 - SIZES.cardPadding * 2}
            accessibilityLabel={t('onboarding.step2Title')}
          />
          <View style={styles.stats}>
            {stats.map((item) => (
              <View
                key={item.label}
                style={[styles.stat, { backgroundColor: colors.surfaceBrandOverlay }]}
              >
                <Text style={[styles.statLabel, { color: colors.textOnBrandMuted }]}>
                  {item.label}
                </Text>
                <Text style={[styles.statValue, { color: colors.white }]}>{item.value}</Text>
              </View>
            ))}
          </View>
        </DarkCard>
        <OnboardingText
          eyebrow={t('tabs.history')}
          title={t('onboarding.step2Title')}
          body={t('onboarding.step2Body')}
        />
      </ScrollView>
      <OnboardingFooter
        backLabel={t('common.back')}
        onBack={() => navigate(APP_ROUTES.onboarding)}
        primaryLabel={t('common.continue')}
        onPrimary={() => navigate(APP_ROUTES.onboardingPreferences)}
      />
    </Screen>
  );
};

export default OnboardingHistoryStep;

const styles = StyleSheet.create({
  screen: { paddingTop: 8, paddingBottom: SIZES.itemGap },
  scroll: { flex: 1 },
  content: { paddingTop: 8, gap: SIZES.sectionGap },
  card: { gap: SIZES.itemGap },
  heroHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SIZES.itemGap,
  },
  cardCaption: { fontFamily: FONTS.body, fontSize: TYPE.secondary },
  rate: {
    fontFamily: FONTS.display,
    fontSize: TYPE.display,
    lineHeight: TYPE.display * 1.05,
    fontVariant: ['tabular-nums'],
  },
  stats: { flexDirection: 'row', gap: 8 },
  stat: {
    flex: 1,
    borderRadius: RADIUS.option,
    paddingVertical: 8,
    paddingHorizontal: SIZES.itemGap,
    gap: 2,
  },
  statValue: { fontFamily: FONTS.display, fontSize: TYPE.body, fontVariant: ['tabular-nums'] },
  statLabel: { fontFamily: FONTS.body, fontSize: TYPE.caption, lineHeight: TYPE.caption * 1.35 },
});
