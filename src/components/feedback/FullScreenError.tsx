import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logo } from '@components/brand/Logo';
import { Button } from '@components/buttons/Button';
import type { IconName } from '@constants/icons';
import { FONTS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

const LOGO_SIZE = 72;
const TOP_GAP = 56;

type FullScreenErrorAction = { label: string; onPress: () => void; icon?: IconName };

interface FullScreenErrorProps {
  /** Rótulo pequeno acima do título, como "Erro inesperado" ou "Erro 404". */
  label: string;
  /** Título da tela. */
  title: string;
  /** Explicação abaixo do título. */
  message: string;
  /** Botão principal, como "Voltar ao início". */
  primaryAction: FullScreenErrorAction;
  /** Botão secundário opcional, como "Tentar de novo". */
  secondaryAction?: FullScreenErrorAction;
}

/**
 * Tela cheia de erro, sem a barra de abas, com o logo estático e até dois botões.
 *
 * Base do `ErrorBoundary` ("Algo deu errado") e da tela de rota não encontrada.
 *
 * @example
 * ```tsx
 * <FullScreenError
 *   label={t('errors.notFound.label')}
 *   title={t('errors.notFound.title')}
 *   message={t('errors.notFound.body')}
 *   primaryAction={{ label: t('errors.notFound.goHome'), icon: 'home', onPress: goHome }}
 * />
 * ```
 */
export function FullScreenError({
  label,
  title,
  message,
  primaryAction,
  secondaryAction,
}: FullScreenErrorProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <View accessibilityRole="alert" style={styles.content}>
        <Logo size={LOGO_SIZE} animated={false} />
        <View style={styles.copy}>
          <Text style={[styles.label, { color: colors.highlightText }]}>{label}</Text>
          <Text accessibilityRole="header" style={[styles.title, { color: colors.textHeading }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Button icon={primaryAction.icon} onPress={primaryAction.onPress}>
          {primaryAction.label}
        </Button>
        {secondaryAction ? (
          <Button variant="secondary" icon={secondaryAction.icon} onPress={secondaryAction.onPress}>
            {secondaryAction.label}
          </Button>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: TOP_GAP,
    paddingHorizontal: SIZES.screenPadding,
    paddingBottom: SIZES.sectionGap,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingHorizontal: 8,
  },
  copy: { gap: 10 },
  label: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: TYPE.secondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: TYPE.title,
    lineHeight: TYPE.title * 1.1,
    textAlign: 'center',
  },
  message: {
    fontFamily: FONTS.body,
    fontSize: TYPE.body,
    lineHeight: TYPE.body * 1.5,
    textAlign: 'center',
  },
  actions: { gap: SIZES.itemGap, paddingBottom: SIZES.cardPadding },
});
