import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { RefreshControl, StyleSheet } from 'react-native';

import { HomeHeader } from '@components/home/HomeHeader';
import { HomeSyncStatus } from '@components/home/HomeSyncStatus';
import { ErrorState } from '@components/feedback/ErrorState';
import { LoadingState } from '@components/feedback/LoadingState';
import { Screen } from '@components/layout/Screen';
import { ScreenHeader } from '@components/layout/ScreenHeader';
import { ListRow } from '@components/list/ListRow';
import { RADIUS, SIZES } from '@constants/theme';
import { usePreferences } from '@contexts/PreferencesContext';
import { useHistory } from '@hooks/useHistory';
import { useLatestRates } from '@hooks/useLatestRates';
import { useSyncStatus } from '@hooks/useSyncStatus';
import { formatMoney, formatRateMoney } from '@utils/format.util';
import { utcDateAtOffset } from '@utils/date.util';
import { useTheme } from '@theme/ThemeProvider';

/**
 * Home tab with the current USD/BRL rate, favorites, and sync status.
 *
 * @example
 * ```tsx
 * <HomeScreen />
 * ```
 */
export default function HomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { navigate } = useRouter();
  const { primaryCurrency, favoriteCurrencies } = usePreferences();
  const latestUsd = useLatestRates('USD');
  const favoriteRates = useLatestRates(primaryCurrency);
  const sync = useSyncStatus();
  const end = utcDateAtOffset(0);
  const start = utcDateAtOffset(-30);
  const history = useHistory({ from: 'USD', to: 'BRL', start, end });

  const refresh = async () => {
    await Promise.all([
      latestUsd.refetch(),
      favoriteRates.refetch(),
      history.refetch(),
      sync.refetch(),
    ]);
  };

  if (latestUsd.isLoading) {
    return (
      <Screen>
        <ScreenHeader title={t('tabs.home')} />
        <LoadingState />
      </Screen>
    );
  }

  if (latestUsd.isError || !latestUsd.data) {
    return (
      <Screen>
        <ScreenHeader title={t('tabs.home')} />
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
      <Screen>
        <ScreenHeader title={t('tabs.home')} />
        <ErrorState error={t('errors.invalidResponse')} onRetry={() => void refresh()} />
      </Screen>
    );
  }

  const sparkline = history.data?.history.map(({ rate: value }) => value) ?? [];
  const favorites = favoriteCurrencies.filter((code) => code !== primaryCurrency);

  return (
    <Screen contentStyle={styles.screen}>
      <FlashList
        data={favorites}
        keyExtractor={(code) => code}
        extraData={favoriteRates.data}
        renderItem={({ item: code, index }) => {
          const baseToFavorite = favoriteRates.data?.rates[code];
          const value =
            code === primaryCurrency
              ? formatMoney(1, primaryCurrency)
              : baseToFavorite
                ? formatRateMoney(1 / baseToFavorite, primaryCurrency)
                : '—';

          return (
            <ListRow
              title={code}
              subtitle={t(`currencies.${code}`)}
              value={value}
              onPress={() =>
                navigate({ pathname: '/history', params: { from: code, to: primaryCurrency } })
              }
              style={[
                styles.favoriteRow,
                { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
                index === 0 && styles.firstFavorite,
                index === favorites.length - 1 && styles.lastFavorite,
              ]}
            />
          );
        }}
        ListHeaderComponent={
          <HomeHeader
            quoteDate={latestUsd.data.date}
            rate={rate}
            sparkline={sparkline}
            primaryCurrencyLabel={t(`currencies.${primaryCurrency}` as const)}
            favoriteCount={favorites.length}
            onOpenSettings={() => navigate('/settings')}
            onOpenConverter={() => navigate('/converter')}
            onOpenHistory={() =>
              navigate({ pathname: '/history', params: { from: 'USD', to: 'BRL' } })
            }
            onOpenRates={() => navigate('/rates')}
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
        contentContainerStyle={styles.listContent}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 0 },
  listContent: { paddingHorizontal: SIZES.screenPadding, paddingBottom: SIZES.sectionGap },
  favoriteRow: { borderLeftWidth: 1, borderRightWidth: 1 },
  firstFavorite: {
    borderTopWidth: 1,
    borderTopLeftRadius: RADIUS.list,
    borderTopRightRadius: RADIUS.list,
  },
  lastFavorite: {
    borderBottomWidth: 1,
    borderBottomLeftRadius: RADIUS.list,
    borderBottomRightRadius: RADIUS.list,
  },
});
