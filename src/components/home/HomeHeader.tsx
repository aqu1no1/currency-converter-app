import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@components/buttons/Button';
import { DarkCard } from '@components/cards/DarkCard';
import { Sparkline } from '@components/charts/Sparkline';
import { CurrencyBadge } from '@components/currency/CurrencyBadge';
import { Pill } from '@components/feedback/Pill';
import { ListBox } from '@components/list/ListBox';
import { ListRow } from '@components/list/ListRow';
import { FONTS, SIZES, TYPE } from '@constants/theme';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { formatDate, formatMoney, formatRateMoney } from '@utils/format.util';
import { useTheme } from '@theme/ThemeProvider';

type HomeHeaderProps = {
  quoteDate: string;

  rate: number;

  sparkline: number[];

  primaryCurrencyLabel: string;

  favoriteCount: number;
  favorites: CurrencyCodeValue[];
  favoriteRates: Partial<Record<CurrencyCodeValue, number>>;
  primaryCurrency: CurrencyCodeValue;

  onOpenConverter: () => void;

  onOpenHistory: () => void;

  onOpenRates: () => void;
  onOpenFavorite: (currency: CurrencyCodeValue) => void;
};
/**
 * [EN] Renders the home heading, featured rate, and grouped favorite currencies.
 * [PT-BR] Renderiza o cabeçalho, a cotação em destaque e as moedas favoritas agrupadas.
 *
 * @example
 * ```tsx
 * <HomeHeader {...exampleProps} />
 * ```
 */

export function HomeHeader({
  quoteDate,
  rate,
  sparkline,
  primaryCurrencyLabel,
  favoriteCount,
  favorites,
  favoriteRates,
  primaryCurrency,
  onOpenConverter,
  onOpenHistory,
  onOpenRates,
  onOpenFavorite,
}: HomeHeaderProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = Math.max(120, screenWidth - SIZES.screenPadding * 2 - SIZES.cardPadding * 2);

  return (
    <View style={styles.container}>
      <DarkCard style={styles.card}>
        <View style={styles.heroHeading}>
          <Text style={[styles.heroLabel, { color: colors.textOnBrandMuted }]}>
            {t('home.featuredPair')}
          </Text>
          <Pill label={t('home.featuredPairCode')} tone="onBrand" />
        </View>
        <Text style={[styles.heroRate, { color: colors.white }]}>{formatMoney(rate, 'BRL')}</Text>
        <Sparkline values={sparkline} width={chartWidth} accessibilityLabel={t('home.rateTrend')} />
        <View style={styles.periodRow}>
          <Text style={[styles.period, { color: colors.textOnBrandMuted }]}>
            {t('home.last30Days')}
          </Text>
          <Text style={[styles.period, { color: colors.textOnBrandMuted }]}>
            {formatDate(quoteDate)}
          </Text>
        </View>
        <View style={styles.heroActions}>
          <Button tone="brand" icon="converter" onPress={onOpenConverter} style={styles.heroAction}>
            {t('tabs.converter')}
          </Button>
          <Button
            tone="brand"
            variant="outline"
            icon="history"
            onPress={onOpenHistory}
            style={styles.heroAction}
          >
            {t('tabs.history')}
          </Button>
        </View>
      </DarkCard>
      <View style={styles.favorites}>
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
        {favorites.length > 0 ? (
          <ListBox>
            {favorites.map((code) => {
              const baseToFavorite = favoriteRates[code];
              const value = baseToFavorite
                ? formatRateMoney(1 / baseToFavorite, primaryCurrency)
                : '—';

              return (
                <ListRow
                  key={code}
                  leading={<CurrencyBadge code={code} />}
                  title={code}
                  subtitle={t(`currencies.${code}` as const)}
                  value={value}
                  onPress={() => onOpenFavorite(code)}
                />
              );
            })}
          </ListBox>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: SIZES.sectionGap },
  card: { gap: SIZES.itemGap },
  heroHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SIZES.itemGap,
  },
  heroLabel: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: TYPE.secondary,
    lineHeight: TYPE.secondary * 1.35,
  },
  heroRate: {
    fontFamily: FONTS.display,
    fontSize: TYPE.display,
    lineHeight: TYPE.display * 1.05,
    fontVariant: ['tabular-nums'],
  },
  periodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  period: { fontFamily: FONTS.body, fontSize: TYPE.caption, lineHeight: TYPE.caption * 1.35 },
  heroActions: { flexDirection: 'row', gap: SIZES.itemGap },
  heroAction: { flex: 1 },
  favorites: { gap: SIZES.itemGap },
  favoritesHeading: {
    minHeight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SIZES.itemGap,
  },
  sectionTitle: {
    flex: 1,
    fontFamily: FONTS.bodySemiBold,
    fontSize: TYPE.section,
    lineHeight: TYPE.section * 1.3,
  },
  seeAllAction: { minHeight: SIZES.touchTarget, justifyContent: 'center' },
  seeAll: { fontFamily: FONTS.bodySemiBold, fontSize: 15 },
  emptyFavorites: { fontFamily: FONTS.body, fontSize: TYPE.secondary },
});
