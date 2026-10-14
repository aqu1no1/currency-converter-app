import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@components/layout/Screen';
import { ScreenHeader } from '@components/layout/ScreenHeader';
import { FONTS, SIZES, TAB_SCREEN_EDGES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

export default function RatesScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Screen edges={TAB_SCREEN_EDGES}>
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
