import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Segmented, type SegmentedOption } from '@components/buttons/Segmented';
import { CurrencyBadge } from '@components/currency/CurrencyBadge';
import { LoadingState } from '@components/feedback/LoadingState';
import { StatusBanner } from '@components/feedback/StatusBanner';
import { Screen } from '@components/layout/Screen';
import { ScreenHeader } from '@components/layout/ScreenHeader';
import { ListBox } from '@components/list/ListBox';
import { SelectModal, type SelectOption } from '@components/select/SelectModal';
import { SettingsRow } from '@components/settings/SettingsRow';
import { SyncLastRunCard } from '@components/settings/SyncLastRunCard';
import { SyncRunRow } from '@components/settings/SyncRunRow';
import { DISPLAY_CURRENCY_ORDER } from '@constants/currencies.constants';
import { HISTORY_START_DATE, RECENT_SYNC_RUNS } from '@constants/sync.constants';
import { FONTS, SIZES, TAB_SCREEN_EDGES, TYPE } from '@constants/theme';
import { usePreferences } from '@contexts/PreferencesContext';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { useCurrencies } from '@hooks/useCurrencies';
import { useOnline } from '@hooks/useOnline';
import { useSyncRuns } from '@hooks/useSyncRuns';
import { useSyncStatus } from '@hooks/useSyncStatus';
import { type Language, resolveLanguage, setLanguage } from '@lib/i18n';
import { getMissingDataKind } from '@utils/api-error.util';
import { type ThemeScheme, useTheme } from '@theme/ThemeProvider';

const LANGUAGE_OPTIONS: readonly SelectOption<Language>[] = [
  { label: 'Português', value: 'pt-BR' },
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
];

type Picker = 'language' | 'currency';

export default function SettingsScreen() {
  const { colors, scheme, setScheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { primaryCurrency, setPrimaryCurrency } = usePreferences();
  const online = useOnline();
  const sync = useSyncStatus();
  const runs = useSyncRuns(RECENT_SYNC_RUNS);
  const currencies = useCurrencies();

  const [picker, setPicker] = useState<Picker | null>(null);

  const language = resolveLanguage(i18n.resolvedLanguage ?? i18n.language);
  const languageLabel = LANGUAGE_OPTIONS.find((option) => option.value === language)?.label ?? '';
  const syncErrorKind = sync.data ? undefined : getMissingDataKind(online, sync);

  const themeOptions: SegmentedOption<ThemeScheme>[] = [
    { label: t('settings.themes.light'), value: 'light', icon: 'themeLight' },
    { label: t('settings.themes.dark'), value: 'dark', icon: 'themeDark' },
    { label: t('settings.themes.system'), value: 'system', icon: 'appearance' },
  ];
  const currencyOptions: SelectOption<CurrencyCodeValue>[] = DISPLAY_CURRENCY_ORDER.map((code) => ({
    value: code,
    label: code,
    description: t(`currencies.${code}` as const),
    leading: <CurrencyBadge code={code} />,
  }));

  const refreshSync = () => {
    void sync.refetch();
    void runs.refetch();
  };

  const changeLanguage = (next: Language) => void setLanguage(next);
  const changeCurrency = (next: CurrencyCodeValue) => void setPrimaryCurrency(next);

  const renderSection = (title: string, children: ReactNode) => (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={[styles.sectionTitle, { color: colors.textHeading }]}>
        {title}
      </Text>
      {children}
    </View>
  );

  const renderSync = () => {
    if (syncErrorKind) {
      return (
        <StatusBanner
          icon={syncErrorKind === 'offline' ? 'offline' : 'syncAlert'}
          message={t(`errors.states.${syncErrorKind}.title`)}
          action={{ label: t('errors.bannerRetry'), onPress: refreshSync }}
        />
      );
    }
    if (!sync.data) return <LoadingState />;

    const items = runs.data?.data ?? [];

    return (
      <>
        <SyncLastRunCard
          lastRun={sync.data.lastRun}
          latestRateDate={sync.data.latestRateDate}
          historyStartDate={HISTORY_START_DATE}
        />
        {items.length > 0 ? (
          <ListBox>
            {items.map((run) => (
              <SyncRunRow key={run.id} run={run} />
            ))}
          </ListBox>
        ) : null}
      </>
    );
  };

  return (
    <Screen edges={TAB_SCREEN_EDGES}>
      <ScreenHeader title={t('settings.title')} context={t('settings.context')} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderSection(
          t('settings.preferences'),
          <ListBox>
            <SettingsRow
              label={t('settings.language')}
              value={languageLabel}
              accessibilityLabel={t('settings.rowLabel', {
                label: t('settings.language'),
                value: languageLabel,
              })}
              onPress={() => setPicker('language')}
            />
            <SettingsRow
              label={t('settings.primaryCurrency')}
              value={primaryCurrency}
              accessibilityLabel={t('settings.rowLabel', {
                label: t('settings.primaryCurrency'),
                value: t(`currencies.${primaryCurrency}` as const),
              })}
              onPress={() => setPicker('currency')}
            />
            <View style={styles.theme}>
              <Text style={[styles.themeLabel, { color: colors.textPrimary }]}>
                {t('settings.theme')}
              </Text>
              <Segmented
                tone="solid"
                options={themeOptions}
                value={scheme}
                onChange={setScheme}
                accessibilityLabel={t('settings.theme')}
              />
            </View>
          </ListBox>,
        )}
        {renderSection(t('settings.sync'), renderSync())}
        {renderSection(
          t('settings.about'),
          <>
            <ListBox>
              <SettingsRow label={t('settings.dataSource')} value={t('settings.dataSourceValue')} />
              <SettingsRow
                label={t('settings.supportedCurrencies')}
                value={String(currencies.data?.length ?? DISPLAY_CURRENCY_ORDER.length)}
              />
            </ListBox>
            <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>
              {t('settings.disclaimer')}
            </Text>
          </>,
        )}
      </ScrollView>
      <SelectModal
        visible={picker === 'language'}
        title={t('settings.pickLanguage')}
        options={LANGUAGE_OPTIONS}
        value={language}
        onSelect={changeLanguage}
        onClose={() => setPicker(null)}
      />
      <SelectModal
        visible={picker === 'currency'}
        title={t('settings.pickCurrency')}
        options={currencyOptions}
        value={primaryCurrency}
        onSelect={changeCurrency}
        onClose={() => setPicker(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { gap: SIZES.sectionGap, paddingBottom: SIZES.sectionGap },
  section: { gap: SIZES.itemGap },
  sectionTitle: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: TYPE.section,
    lineHeight: TYPE.section * 1.3,
  },
  theme: {
    paddingVertical: SIZES.itemGap,
    paddingHorizontal: SIZES.cardPadding,
    gap: SIZES.itemGap,
  },
  themeLabel: { fontFamily: FONTS.body, fontSize: TYPE.body, lineHeight: TYPE.body * 1.35 },
  disclaimer: { fontFamily: FONTS.body, fontSize: TYPE.caption, lineHeight: TYPE.caption * 1.35 },
});
