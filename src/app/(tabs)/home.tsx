import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { RefreshControl, StyleSheet, View } from 'react-native';

import { HomeHeader } from '@components/home/HomeHeader';
import { HomeSyncStatus } from '@components/home/HomeSyncStatus';
import { ErrorState } from '@components/feedback/ErrorState';
import { LoadingState } from '@components/feedback/LoadingState';
import { StaleDataBanner } from '@components/feedback/StaleDataBanner';
import { Screen } from '@components/layout/Screen';
import { ScreenHeader } from '@components/layout/ScreenHeader';
import { SIZES, TAB_SCREEN_EDGES } from '@constants/theme';
import { usePreferences } from '@contexts/PreferencesContext';
import { useHistory } from '@hooks/useHistory';
import { useLatestRates } from '@hooks/useLatestRates';
import { useOnline } from '@hooks/useOnline';
import { useSyncStatus } from '@hooks/useSyncStatus';
import { getMissingDataKind } from '@utils/api-error.util';
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
  const online = useOnline();
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

  const openSettings = () => navigate('/settings');

  const errorKind = latestUsd.data ? undefined : getMissingDataKind(online, latestUsd);

  const header = (
    <ScreenHeader
      title={t('tabs.home')}
      context={
        latestUsd.data
          ? t('home.quoteDate', { date: formatDate(latestUsd.data.date) })
          : errorKind && t(`errors.states.${errorKind}.context`)
      }
      action={{
        icon: 'settings',
        accessibilityLabel: t('tabs.settings'),
        onPress: openSettings,
      }}
    />
  );

  const rate = latestUsd.data?.rates.BRL;

  if (!latestUsd.data || rate === undefined) {
    const kind = errorKind ?? (latestUsd.data ? 'unknown' : undefined);

    return (
      <Screen edges={TAB_SCREEN_EDGES}>
        {header}
        {kind ? (
          <ErrorState kind={kind} onRetry={() => void refresh()} onOpenSyncStatus={openSettings} />
        ) : (
          <LoadingState />
        )}
      </Screen>
    );
  }

  const sparkline = history.data?.history.map(({ rate: value }) => value) ?? [];
  const favorites = favoriteCurrencies.filter((code) => code !== primaryCurrency);

  return (
    <Screen edges={TAB_SCREEN_EDGES} contentStyle={styles.screen}>
      <View style={styles.header}>
        {header}
        <StaleDataBanner
          date={latestUsd.data.date}
          failed={latestUsd.isError}
          onRetry={() => void refresh()}
        />
      </View>
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
            quoteDate={latestUsd.data.date}
            onPress={openSettings}
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
