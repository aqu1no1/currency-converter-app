import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@components/icons/Icon';
import { FONTS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

const ICON_SIZE = 64;

interface HistoryEmptyProps {
  /** Título do aviso, como "Sem cotações nesse período". */
  title: string;
  /** Dica abaixo do título. */
  message: string;
}

/**
 * Aviso de período sem cotações, para usar dentro do card escuro do Histórico.
 *
 * Mostra um ícone de calendário, o título e a dica centralizados, e é anunciado
 * pelo leitor de tela.
 *
 * @example
 * ```tsx
 * <HistoryEmpty title={t('history.emptyTitle')} message={t('history.emptyBody')} />
 * ```
 */
export function HistoryEmpty({ title, message }: HistoryEmptyProps) {
  const { colors } = useTheme();

  return (
    <View accessible accessibilityRole="alert" style={styles.container}>
      <View style={[styles.icon, { backgroundColor: colors.surfaceBrandOverlay }]}>
        <Icon name="emptyHistory" size={32} color={colors.accent} />
      </View>
      <Text style={[styles.title, { color: colors.white }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textOnBrandMuted }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 8, paddingVertical: SIZES.sectionGap },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: TYPE.section,
    lineHeight: TYPE.section * 1.3,
    textAlign: 'center',
  },
  message: {
    fontFamily: FONTS.body,
    fontSize: TYPE.secondary,
    lineHeight: TYPE.secondary * 1.35,
    textAlign: 'center',
  },
});
