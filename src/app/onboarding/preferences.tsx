import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Segmented, type SegmentedOption } from '@components/buttons/Segmented';
import { CurrencyGrid } from '@components/onboarding/CurrencyGrid';
import { OnboardingFooter } from '@components/onboarding/OnboardingFooter';
import { OnboardingHeader } from '@components/onboarding/OnboardingHeader';
import { OnboardingText } from '@components/onboarding/OnboardingText';
import { Screen } from '@components/layout/Screen';
import { SIZES, FONTS, TYPE } from '@constants/theme';
import { APP_ROUTES } from '@constants/routes.constants';
import { useCompleteOnboarding } from '@hooks/useCompleteOnboarding';
import { resolveLanguage, setLanguage, type Language } from '@lib/i18n';
import { usePreferences } from '@contexts/PreferencesContext';
import { useTheme } from '@theme/ThemeProvider';

const LANGUAGE_OPTIONS: readonly SegmentedOption<Language>[] = [
  { label: 'Português', value: 'pt-BR' },
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
];
/**
 * Final onboarding step for primary currency and language preferences.
 *
 * @example
 * ```tsx
 * <OnboardingPreferencesStep />
 * ```
 */
export default function OnboardingPreferencesStep() {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const { navigate } = useRouter();
  const { primaryCurrency, setPrimaryCurrency } = usePreferences();
  const completeOnboarding = useCompleteOnboarding();
  const language = resolveLanguage(i18n.resolvedLanguage ?? i18n.language);

  return (
    <Screen contentStyle={styles.screen}>
      <OnboardingHeader step={3} />
      <View style={styles.content}>
        <OnboardingText
          eyebrow={t('onboarding.preferencesEyebrow')}
          title={t('onboarding.step3Title')}
          body={t('onboarding.step3Body')}
        />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>
            {t('onboarding.primaryCurrency')}
          </Text>
          <CurrencyGrid
            selectedCurrency={primaryCurrency}
            onSelectCurrency={(next) => void setPrimaryCurrency(next)}
            accessibilityLabel={t('onboarding.primaryCurrency')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>
            {t('onboarding.language')}
          </Text>
          <Segmented
            options={LANGUAGE_OPTIONS}
            value={language}
            onChange={(nextLanguage) => void setLanguage(nextLanguage)}
            accessibilityLabel={t('onboarding.language')}
          />
        </View>

        <Text style={[styles.note, { color: colors.textSecondary }]}>
          {t('onboarding.changeLater')}
        </Text>
      </View>

      <OnboardingFooter
        backLabel={t('common.back')}
        onBack={() => navigate(APP_ROUTES.onboardingHistory)}
        primaryLabel={t('onboarding.start')}
        onPrimary={() => void completeOnboarding()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 8, paddingBottom: SIZES.itemGap },
  content: { flex: 1, justifyContent: 'center', gap: SIZES.sectionGap },
  section: { gap: SIZES.itemGap },
  sectionTitle: { fontFamily: FONTS.bodySemiBold, fontSize: TYPE.section },
  note: { fontFamily: FONTS.body, fontSize: TYPE.secondary, lineHeight: TYPE.secondary * 1.4 },
});
