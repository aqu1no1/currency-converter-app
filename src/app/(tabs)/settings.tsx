import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Segmented, type SegmentedOption } from '@components/buttons/Segmented';
import { CurrencyGrid } from '@components/onboarding/CurrencyGrid';
import { ScreenHeader } from '@components/layout/ScreenHeader';
import { Screen } from '@components/layout/Screen';
import { SIZES, FONTS, TAB_SCREEN_EDGES, TYPE } from '@constants/theme';
import { usePreferences } from '@contexts/PreferencesContext';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { resolveLanguage, setLanguage, type Language } from '@lib/i18n';
import { useTheme } from '@theme/ThemeProvider';

const LANGUAGE_OPTIONS: readonly SegmentedOption<Language>[] = [
  { label: 'Português', value: 'pt-BR' },
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
];

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const { primaryCurrency, setPrimaryCurrency } = usePreferences();

  const language = resolveLanguage(i18n.resolvedLanguage ?? i18n.language);

  const selectCurrency = (next: CurrencyCodeValue) => void setPrimaryCurrency(next);
  const changeLanguage = (next: Language) => void setLanguage(next);

  return (
    <Screen edges={TAB_SCREEN_EDGES} contentStyle={styles.screen}>
      <View style={styles.content}>
        <ScreenHeader title={t('settings.title')} />
        <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>
          {t('settings.primaryCurrency')}
        </Text>
        <CurrencyGrid
          selectedCurrency={primaryCurrency}
          onSelectCurrency={selectCurrency}
          accessibilityLabel={t('settings.primaryCurrency')}
        />
        <View style={styles.languageSection}>
          <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>
            {t('settings.language')}
          </Text>
          <Segmented
            options={LANGUAGE_OPTIONS}
            value={language}
            onChange={changeLanguage}
            accessibilityLabel={t('settings.language')}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0 },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.screenPadding,
    paddingBottom: SIZES.sectionGap,
    gap: SIZES.sectionGap,
  },
  sectionTitle: { fontFamily: FONTS.bodySemiBold, fontSize: TYPE.section },
  languageSection: { gap: SIZES.itemGap, marginTop: SIZES.sectionGap },
});
