import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { RefreshControl, StyleSheet, View } from 'react-native';

import { HomeHeader } from '@components/home/HomeHeader';
import { HomeSyncStatus } from '@components/home/HomeSyncStatus';
import { ErrorState } from '@components/feedback/ErrorState';
import { LoadingState } from '@components/feedback/LoadingState';
import { Screen } from '@components/layout/Screen';
import { ScreenHeader } from '@components/layout/ScreenHeader';
import { SIZES, TAB_SCREEN_EDGES } from '@constants/theme';
import { usePreferences } from '@contexts/PreferencesContext';
import { useHistory } from '@hooks/useHistory';
import { useLatestRates } from '@hooks/useLatestRates';
import { useSyncStatus } from '@hooks/useSyncStatus';
import { utcDateAtOffset } from '@utils/date.util';
import { formatDate } from '@utils/format.util';
import { useTheme } from '@theme/ThemeProvider';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { navigate } = useRouter();
  const { primaryCurrency, favoriteCurrencies } = usePreferences();
  const latestUsd = useLatestRates('USD');
  const favoriteRates = useLatestRates(primaryCurrency);
  const sync = useSyncStatus();
  const history = useHistory({
    from: 'USD',
    to: 'BRL',
    start: utcDateAtOffset(-30),
    end: utcDateAtOffset(0),
  });

  const refresh = async () => {
    await Promise.all([
      latestUsd.refetch(),
      favoriteRates.refetch(),
      history.refetch(),
      sync.refetch(),
    ]);
  };

  const header = (
    <ScreenHeader
      title={t('tabs.home')}
      context={
        latestUsd.data ? t('home.quoteDate', { date: formatDate(latestUsd.data.date) }) : undefined
      }
      action={{
        icon: 'settings',
        accessibilityLabel: t('tabs.settings'),
        onPress: () => navigate('/settings'),
      }}
    />
  );

  if (latestUsd.isLoading) {
    return (
      <Screen edges={TAB_SCREEN_EDGES}>
        {header}
        <LoadingState />
      </Screen>
    );
  }

  if (latestUsd.isError || !latestUsd.data) {
    return (
      <Screen edges={TAB_SCREEN_EDGES}>
        {header}
        <ErrorState
          error={latestUsd.error ?? t('home.retryRates')}
          onRetry={() => void refresh()}
        />
      </Screen>
    );
  }

  const rate = latestUsd.data.rates.BRL;
  if (rate === undefined) {
    return (
      <Screen edges={TAB_SCREEN_EDGES}>
        {header}
        <ErrorState error={t('errors.invalidResponse')} onRetry={() => void refresh()} />
      </Screen>
    );
  }

  const sparkline = history.data?.history.map(({ rate: value }) => value) ?? [];
  const favorites = favoriteCurrencies.filter((code) => code !== primaryCurrency);

  return (
    <Screen edges={TAB_SCREEN_EDGES} contentStyle={styles.screen}>
      <View style={styles.header}>{header}</View>
      <FlashList
        data={[]}
        keyExtractor={(_, index) => String(index)}
        extraData={favoriteRates.data}
        renderItem={() => null}
        ListHeaderComponent={
          <HomeHeader
            quoteDate={latestUsd.data.date}
            rate={rate}
            sparkline={sparkline}
            primaryCurrencyLabel={t(`currencies.plural.${primaryCurrency}` as const)}
            favoriteCount={favorites.length}
            favorites={favorites}
            favoriteRates={favoriteRates.data?.rates ?? {}}
            primaryCurrency={primaryCurrency}
            onOpenConverter={() => navigate('/converter')}
            onOpenHistory={() =>
              navigate({ pathname: '/history', params: { from: 'USD', to: 'BRL' } })
            }
            onOpenRates={() => navigate('/rates')}
            onOpenFavorite={(code) =>
              navigate({ pathname: '/history', params: { from: code, to: primaryCurrency } })
            }
          />
        }
        ListFooterComponent={
          <HomeSyncStatus
            lastRun={sync.data?.lastRun ?? null}
            hasError={sync.isError}
            onPress={() => navigate('/settings')}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={latestUsd.isRefetching || history.isRefetching || sync.isRefetching}
            onRefresh={() => void refresh()}
            tintColor={colors.highlight}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 0 },
  header: { paddingHorizontal: SIZES.screenPadding },
  listContent: { paddingHorizontal: SIZES.screenPadding, paddingBottom: SIZES.sectionGap },
});
