import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

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
const SUMMARY_CARD_HEIGHT = 76;

type SummaryStat = { label: string; value: string };

function getFallbackHistory(): HistoryPoint[] {
  return FALLBACK_RATES.map((value, index) => {
    const date = new Date(Date.now() - (FALLBACK_RATES.length - index - 1) * 30 * TIME_IN_MS.DAY);
    const isoDate = date.toISOString().slice(0, 10);
    return { value, label: formatDate(isoDate), date: isoDate };
  });
}

function getHistoryRange() {
  const referenceDate = new Date();
  return {
    end: utcDateAtOffset(0, referenceDate),
    start: utcDateAtOffset(-TIME_IN_MS.YEAR / TIME_IN_MS.DAY, referenceDate),
  };
}

function sampleHistory(history: { date: string; rate: number }[]): HistoryPoint[] {
  if (history.length <= 13) {
    return history.map(({ date, rate }) => ({ value: rate, label: formatDate(date), date }));
  }

  const interval = Math.max(1, Math.floor(history.length / 12));
  return history
    .filter((_, index) => index % interval === 0 || index === history.length - 1)
    .map(({ date, rate }) => ({ value: rate, label: formatDate(date), date }));
}

/**
 * Second onboarding step: introduce the user to exchange-rate history.
 *
 * @example
 * ```tsx
 * <OnboardingHistoryStep />
 * ```
 */
export default function OnboardingHistoryStep() {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const { navigate } = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const statsWidth = screenWidth - SIZES.screenPadding * 2 - SIZES.cardPadding * 2;
  const statWidth = (statsWidth - SIZES.itemGap * 2) / 3;
  const completeOnboarding = useCompleteOnboarding();
  const reduceMotion = useReduceMotion();
  const { start, end } = getHistoryRange();
  const { data } = useHistory({ from: 'USD', to: 'BRL', start, end });
  const allRates = data?.history.length ? data.history.map(({ rate }) => rate) : FALLBACK_RATES;
  const points = data?.history.length ? sampleHistory(data.history) : getFallbackHistory();
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
    { label: t('onboarding.since2000'), value: '2000' },
  ];

  return (
    <Screen contentStyle={styles.screen}>
      <OnboardingHeader step={2} onSkip={() => void completeOnboarding()} />
      <View style={styles.content}>
        <DarkCard style={styles.card}>
          <View style={styles.heroHeading}>
            <Text style={[styles.cardCaption, { color: colors.textOnBrandMuted }]}>
              {t('onboarding.pair')}
            </Text>
            <Pill
              label={t('onboarding.variation', { direction, value: `${variation}%` })}
              tone={change >= 0 ? 'success' : 'warning'}
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
            width={screenWidth - SIZES.screenPadding * 2 - SIZES.cardPadding * 2}
            accessibilityLabel={t('onboarding.step2Title')}
          />
          <FlashList
            horizontal
            data={stats}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.stat,
                  { width: statWidth, backgroundColor: colors.surfaceBrandOverlay },
                ]}
              >
                <Text style={[styles.statValue, { color: colors.white }]}>{item.value}</Text>
                <Text style={[styles.statLabel, { color: colors.textOnBrandMuted }]}>
                  {item.label}
                </Text>
              </View>
            )}
            style={{ height: SUMMARY_CARD_HEIGHT, width: statsWidth }}
            contentContainerStyle={styles.statsContent}
          />
        </DarkCard>
        <OnboardingText
          eyebrow={t('tabs.history')}
          title={t('onboarding.step2Title')}
          body={t('onboarding.step2Body')}
        />
      </View>
      <OnboardingFooter
        backLabel={t('common.back')}
        onBack={() => navigate(APP_ROUTES.onboarding)}
        primaryLabel={t('common.continue')}
        onPrimary={() => navigate(APP_ROUTES.onboardingPreferences)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 8, paddingBottom: SIZES.itemGap },
  content: { flex: 1, justifyContent: 'center', gap: SIZES.sectionGap },
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
  statsList: { height: SUMMARY_CARD_HEIGHT, width: '100%' },
  statsContent: { gap: SIZES.itemGap },
  stat: {
    minHeight: SUMMARY_CARD_HEIGHT,
    borderRadius: RADIUS.option,
    padding: 8,
    justifyContent: 'center',
    gap: 4,
  },
  statValue: { fontFamily: FONTS.display, fontSize: TYPE.value, fontVariant: ['tabular-nums'] },
  statLabel: { fontFamily: FONTS.body, fontSize: TYPE.caption },
});
