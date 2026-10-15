import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@components/icons/Icon';
import type { IconName } from '@constants/icons';
import { FONTS, RADIUS, SIZES } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

const TEXT_SIZE = 14;

interface StatusBannerProps {
  /** Texto do aviso, como "Sem conexão. Mostrando as cotações salvas de 28/09/2026.". */
  message: string;
  /** Ícone à esquerda do texto. */
  icon?: IconName;
  /** Ação curta à direita, como "Tentar"; sem ela, o aviso fica só com o texto. */
  action?: { label: string; onPress: () => void };
}

/**
 * Aviso laranja de uma linha para quando a tela ainda tem dados para mostrar.
 *
 * Fica entre o cabeçalho e o conteúdo e é anunciado pelo leitor de tela como status,
 * sem tirar o foco do que o usuário está fazendo.
 *
 * @example
 * ```tsx
 * <StatusBanner
 *   message={t('errors.offlineBanner', { date: formatDate(latest.data.date) })}
 *   action={{ label: t('errors.bannerRetry'), onPress: () => void latest.refetch() }}
 * />
 * ```
 */
export function StatusBanner({ message, icon = 'offline', action }: StatusBannerProps) {
  const { colors } = useTheme();

  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        styles.banner,
        { backgroundColor: colors.warningBackground, borderColor: colors.warningBorder },
      ]}
    >
      <Icon name={icon} size={20} color={colors.warningText} />
      <Text style={[styles.message, { color: colors.warningText }]}>{message}</Text>
      {action ? (
        <Pressable
          accessibilityRole="button"
          onPress={action.onPress}
          hitSlop={4}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <Text style={[styles.actionLabel, { color: colors.warningText }]}>{action.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginBottom: SIZES.cardPadding,
    paddingVertical: SIZES.itemGap,
    paddingLeft: SIZES.cardPadding,
    paddingRight: SIZES.itemGap,
    borderWidth: 1,
    borderRadius: RADIUS.button,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.itemGap,
  },
  message: { flex: 1, fontFamily: FONTS.body, fontSize: TEXT_SIZE, lineHeight: TEXT_SIZE * 1.4 },
  action: {
    minHeight: SIZES.touchTarget,
    paddingHorizontal: SIZES.itemGap,
    justifyContent: 'center',
    borderRadius: RADIUS.option,
  },
  pressed: { opacity: 0.7 },
  actionLabel: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: TEXT_SIZE,
    textDecorationLine: 'underline',
  },
});
