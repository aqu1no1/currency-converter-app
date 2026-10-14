import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { DarkCard } from '@components/cards/DarkCard';
import { OnboardingFooter } from '@components/onboarding/OnboardingFooter';
import { OnboardingHeader } from '@components/onboarding/OnboardingHeader';
import { OnboardingRateRow } from '@components/onboarding/OnboardingRateRow';
import { OnboardingText } from '@components/onboarding/OnboardingText';
import { Screen } from '@components/layout/Screen';
import { APP_ROUTES } from '@constants/routes.constants';
import { FONTS, SIZES, TYPE } from '@constants/theme';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { useCompleteOnboarding } from '@hooks/useCompleteOnboarding';
import { useLatestRates } from '@hooks/useLatestRates';
import { formatMoney } from '@utils/format.util';
import { useTheme } from '@theme/ThemeProvider';

type TargetCurrency = Extract<CurrencyCodeValue, 'USD' | 'EUR' | 'GBP' | 'ARS'>;

type OnboardingRate = {
  code: TargetCurrency;
  amount: number;
};

const TARGET_CURRENCIES: readonly TargetCurrency[] = ['USD', 'EUR', 'GBP', 'ARS'];
const FALLBACK_RATES: Record<TargetCurrency, number> = {
  USD: 0.1926,
  EUR: 0.1689,
  GBP: 0.1441,
  ARS: 279.78,
};

export default function OnboardingFirstStep() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { navigate } = useRouter();
  const { data } = useLatestRates('BRL');

  const completeOnboarding = useCompleteOnboarding();

  const rates = data?.rates;
  const rows: OnboardingRate[] = TARGET_CURRENCIES.map((code) => ({
    code,
    amount: 100 * (rates?.[code] ?? FALLBACK_RATES[code]),
  }));

  const goNext = () => navigate(APP_ROUTES.onboardingHistory);
  const skip = () => void completeOnboarding();

  return (
    <Screen contentStyle={styles.screen}>
      <OnboardingHeader step={1} onSkip={skip} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <DarkCard style={styles.card}>
          <Text style={[styles.cardCaption, { color: colors.textOnBrandMuted }]}>
            {t('onboarding.youType')}
          </Text>
          <Text style={[styles.amount, { color: colors.white }]}>{formatMoney(100, 'BRL')}</Text>
          <Text style={[styles.cardCaption, { color: colors.textOnBrandMuted }]}>
            {t('onboarding.seeEveryCurrency')}
          </Text>
          <View style={styles.rateRows}>
            {rows.map((item) => (
              <OnboardingRateRow
                key={item.code}
                code={item.code}
                value={formatMoney(item.amount, item.code)}
              />
            ))}
          </View>
        </DarkCard>

        <OnboardingText
          eyebrow={t('onboarding.converterEyebrow')}
          title={t('onboarding.step1Title')}
          body={t('onboarding.step1Body')}
        />
      </ScrollView>

      <OnboardingFooter primaryLabel={t('common.continue')} onPrimary={goNext} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 8, paddingBottom: SIZES.itemGap },
  scroll: { flex: 1 },
  content: { paddingTop: 8, gap: SIZES.sectionGap },
  card: { gap: SIZES.itemGap },
  cardCaption: {
    fontFamily: FONTS.body,
    fontSize: TYPE.secondary,
    lineHeight: TYPE.secondary * 1.35,
  },
  amount: {
    fontFamily: FONTS.display,
    fontSize: TYPE.display,
    lineHeight: TYPE.display * 1.05,
    fontVariant: ['tabular-nums'],
  },
  rateRows: { gap: 8 },
});
