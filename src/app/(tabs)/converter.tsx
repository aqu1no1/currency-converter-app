import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@components/layout/Screen';
import { ScreenHeader } from '@components/layout/ScreenHeader';
import { FONTS, SIZES, TAB_SCREEN_EDGES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';
/**
 * [EN] Provides the currency conversion screen.
 * [PT-BR] Exibe a tela de conversão de moedas.
 *
 * @example
 * ```tsx
 * <Converter {...exampleProps} />
 * ```
 */

export default function Converter() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Screen edges={TAB_SCREEN_EDGES}>
      <ScreenHeader title={t('tabs.converter')} />
      <Text style={[styles.text, { color: colors.textSecondary }]}>{t('common.comingSoon')}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  text: { marginTop: SIZES.sectionGap, fontFamily: FONTS.body, fontSize: TYPE.body },
});
