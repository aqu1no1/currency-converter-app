import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@components/layout/Screen';
import { ScreenHeader } from '@components/layout/ScreenHeader';
import { FONTS, SIZES, TAB_SCREEN_EDGES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';
/**
 * [EN] Lists the latest rates for supported currencies.
 * [PT-BR] Lista as cotações mais recentes das moedas disponíveis.
 *
 * @example
 * ```tsx
 * <RatesScreen />
 * ```
 */

const RatesScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Screen edges={TAB_SCREEN_EDGES}>
      <ScreenHeader title={t('rates.title')} />
      <Text style={[styles.placeholder, { color: colors.textSecondary }]}>
        {t('common.comingSoon')}
      </Text>
    </Screen>
  );
};

export default RatesScreen;

const styles = StyleSheet.create({
  placeholder: { marginTop: SIZES.sectionGap, fontFamily: FONTS.body, fontSize: TYPE.body },
});
