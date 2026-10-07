import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

export default function Onboarding() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.textPrimary }]}>{t('common.comingSoon')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: TYPE.body,
  },
});
