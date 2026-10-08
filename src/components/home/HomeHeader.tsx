import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@components/buttons/Button';
import { DarkCard } from '@components/cards/DarkCard';
import { Sparkline } from '@components/charts/Sparkline';
import { Pill } from '@components/feedback/Pill';
import { ScreenHeader } from '@components/layout/ScreenHeader';
import { FONTS, SIZES, TYPE } from '@constants/theme';
import { formatDate, formatMoney } from '@utils/format.util';
import { useTheme } from '@theme/ThemeProvider';

type HomeHeaderProps = {
  /** Data da cotação mais recente. */
  quoteDate: string;
  /** Cotação atual USD/BRL. */
  rate: number;
  /** Série dos últimos 30 dias para o Sparkline. */
  sparkline: number[];
  /** Nome traduzido da moeda principal. */
  primaryCurrencyLabel: string;
  /** Quantidade de moedas favoritas exibidas. */
  favoriteCount: number;
  /** Abre Ajustes. */
  onOpenSettings: () => void;
  /** Abre Converter. */
  onOpenConverter: () => void;
  /** Abre Histórico para o par em destaque. */
  onOpenHistory: () => void;
  /** Abre Cotações. */
  onOpenRates: () => void;
};

/**
 * Home header, highlighted currency pair, and favorites section heading.
 *
 * @example
 * ```tsx
 * <HomeHeader quoteDate={date} rate={rate} sparkline={values} primaryCurrencyLabel={currencyName} favoriteCount={4} onOpenSettings={openSettings} onOpenConverter={openConverter} onOpenHistory={openHistory} onOpenRates={openRates} />
 * ```
 */
export function HomeHeader({
  quoteDate,
  rate,
  sparkline,
  primaryCurrencyLabel,
  favoriteCount,
  onOpenSettings,
  onOpenConverter,
  onOpenHistory,
  onOpenRates,
}: HomeHeaderProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = Math.max(120, screenWidth - SIZES.screenPadding * 2 - SIZES.cardPadding * 2);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={t('tabs.home')}
        context={t('home.quoteDate', { date: formatDate(quoteDate) })}
        action={{
          icon: 'settings',
          accessibilityLabel: t('tabs.settings'),
          onPress: onOpenSettings,
        }}
      />
      <DarkCard>
        <View style={styles.heroHeading}>
          <Text style={[styles.heroLabel, { color: colors.textOnBrandMuted }]}>
            {t('home.featuredPair')}
          </Text>
          <Pill label={t('home.featuredPairCode')} tone="info" />
        </View>
        <Text style={[styles.heroRate, { color: colors.white }]}>{formatMoney(rate, 'BRL')}</Text>
        <Sparkline values={sparkline} width={chartWidth} accessibilityLabel={t('home.rateTrend')} />
        <Text style={[styles.period, { color: colors.textOnBrandMuted }]}>
          {t('home.last30Days')}
        </Text>
        <View style={styles.heroActions}>
          <Button tone="brand" icon="converter" onPress={onOpenConverter}>
            {t('tabs.converter')}
          </Button>
          <Button tone="brand" variant="outline" icon="history" onPress={onOpenHistory}>
            {t('tabs.history')}
          </Button>
        </View>
      </DarkCard>
      <View style={styles.favoritesHeading}>
        <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>
          {t('home.favoritesTitle', { currency: primaryCurrencyLabel })}
        </Text>
        <Pressable accessibilityRole="link" onPress={onOpenRates} style={styles.seeAllAction}>
          <Text style={[styles.seeAll, { color: colors.highlight }]}>{t('home.seeAll')}</Text>
        </Pressable>
      </View>
      {favoriteCount === 0 ? (
        <Text style={[styles.emptyFavorites, { color: colors.textSecondary }]}>
          {t('currencies.emptyFavorites')}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: SIZES.sectionGap },
  heroHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SIZES.itemGap,
  },
  heroLabel: { flex: 1, fontFamily: FONTS.body, fontSize: TYPE.secondary },
  heroRate: {
    fontFamily: FONTS.display,
    fontSize: TYPE.display,
    lineHeight: TYPE.display * 1.05,
    fontVariant: ['tabular-nums'],
  },
  period: { fontFamily: FONTS.body, fontSize: TYPE.caption },
  heroActions: { flexDirection: 'row', gap: SIZES.itemGap },
  favoritesHeading: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SIZES.itemGap,
  },
  sectionTitle: { flex: 1, fontFamily: FONTS.bodySemiBold, fontSize: TYPE.section },
  seeAllAction: { minHeight: SIZES.touchTarget, justifyContent: 'center' },
  seeAll: { fontFamily: FONTS.bodySemiBold, fontSize: TYPE.secondary },
  emptyFavorites: { fontFamily: FONTS.body, fontSize: TYPE.secondary },
});
