import { StyleSheet, Text, View } from 'react-native';

import { IconButton } from '@components/buttons/IconButton';
import type { IconName } from '@constants/icons';
import { FONTS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

interface ScreenHeaderProps {
  /** Título da tela. */
  title: string;
  /** Linha menor acima do título, como a data da cotação. */
  context?: string;
  /** Botão circular opcional à direita, com ícone, rótulo e ação. */
  action?: { icon: IconName; accessibilityLabel: string; onPress: () => void };
}

/**
 * Cabeçalho das telas com título, contexto opcional e um botão de ação.
 *
 * O conteúdo fica alinhado embaixo, como nos designs das abas.
 *
 * @example
 * ```tsx
 * <ScreenHeader
 *   title={t('tabs.home')}
 *   context={t('home.quoteDate', { date })}
 *   action={{ icon: 'settings', accessibilityLabel: t('tabs.settings'), onPress: openSettings }}
 * />
 * ```
 */
export function ScreenHeader({ title, context, action }: ScreenHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        {context ? (
          <Text style={[styles.context, { color: colors.textSecondary }]}>{context}</Text>
        ) : null}
        <Text accessibilityRole="header" style={[styles.title, { color: colors.textHeading }]}>
          {title}
        </Text>
      </View>
      {action ? (
        <IconButton
          name={action.icon}
          accessibilityLabel={action.accessibilityLabel}
          onPress={action.onPress}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SIZES.itemGap,
  },
  copy: { flex: 1, gap: 4 },
  context: {
    fontFamily: FONTS.bodyMedium,
    fontSize: TYPE.secondary,
    lineHeight: TYPE.secondary * 1.35,
  },
  title: { fontFamily: FONTS.display, fontSize: TYPE.title, lineHeight: TYPE.title * 1.1 },
});
