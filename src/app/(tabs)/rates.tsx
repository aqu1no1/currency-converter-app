import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@components/layout/Screen';
import { ScreenHeader } from '@components/layout/ScreenHeader';
import { FONTS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

/**
 * Placeholder route for the rates tab until the rates screen is implemented.
 *
 * @example
 * ```tsx
 * <RatesScreen />
 * ```
 */
export default function RatesScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Screen>
      <ScreenHeader title={t('rates.title')} />
      <Text style={[styles.placeholder, { color: colors.textSecondary }]}>
        {t('common.comingSoon')}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  placeholder: { marginTop: SIZES.sectionGap, fontFamily: FONTS.body, fontSize: TYPE.body },
});
