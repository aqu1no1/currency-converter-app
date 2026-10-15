import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@components/buttons/Button';
import { Icon } from '@components/icons/Icon';
import type { IconName } from '@constants/icons';
import { FONTS, RADIUS, SIZES, TYPE } from '@constants/theme';
import { type ErrorKind, getErrorKind } from '@utils/api-error.util';
import { useTheme } from '@theme/ThemeProvider';

const ICON_BOX = 72;
const TITLE_SIZE = 22;

const SYNC_STATUS_KINDS: readonly ErrorKind[] = ['server', 'timeout'];

const KIND_ICONS = {
  offline: 'offline',
  timeout: 'serverDown',
  server: 'serverDown',
  notReady: 'pending',
  notFound: 'error',
  unknown: 'error',
} as const satisfies Record<ErrorKind, IconName>;

interface ErrorStateProps {
  /** Erro da consulta; o tipo (sem conexão, servidor, 503...) é descoberto a partir dele. */
  error?: unknown;
  /** Tipo do erro, quando a tela já sabe qual é; tem prioridade sobre `error`. */
  kind?: ErrorKind;
  /** Ação do botão principal ("Tentar de novo" ou "Atualizar"); sem ela, o botão não aparece. */
  onRetry?: () => void;
  /** Abre o status da sincronização; vira o link "Ver status da sincronização" quando o servidor falhou. */
  onOpenSyncStatus?: () => void;
}

/**
 * Estado de erro de tela inteira com ícone, título, texto e ações.
 *
 * Usado quando a tela não tem nada salvo para mostrar. O ícone, os textos e o rótulo
 * do botão vêm do tipo do erro: sem conexão, servidor fora do ar ou demorando,
 * cotações ainda não disponíveis (503), não encontrado (404) ou inesperado. Quando o
 * servidor falhou, mostra também o link para o status da sincronização.
 *
 * @example
 * ```tsx
 * <ErrorState
 *   error={latest.error}
 *   onRetry={() => void latest.refetch()}
 *   onOpenSyncStatus={() => navigate('/settings')}
 * />
 * ```
 */
export function ErrorState({ error, kind, onRetry, onOpenSyncStatus }: ErrorStateProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const resolved = kind ?? getErrorKind(error);
  const showSyncStatus = onOpenSyncStatus && SYNC_STATUS_KINDS.includes(resolved);

  return (
    <View accessibilityRole="alert" style={styles.container}>
      <View style={[styles.icon, { backgroundColor: colors.mintSoft }]}>
        <Icon name={KIND_ICONS[resolved]} size={32} color={colors.textHeading} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: colors.textHeading }]}>
          {t(`errors.states.${resolved}.title`)}
        </Text>
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {t(`errors.states.${resolved}.body`)}
        </Text>
      </View>
      {onRetry || showSyncStatus ? (
        <View style={styles.actions}>
          {onRetry ? (
            <Button icon="refresh" onPress={onRetry}>
              {t(`errors.states.${resolved}.action`)}
            </Button>
          ) : null}
          {showSyncStatus ? (
            <Button variant="secondary" onPress={onOpenSyncStatus}>
              {t('errors.viewSyncStatus')}
            </Button>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.sectionGap,
    paddingHorizontal: SIZES.itemGap,
    paddingBottom: SIZES.sectionGap,
  },
  icon: {
    width: ICON_BOX,
    height: ICON_BOX,
    borderRadius: RADIUS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { gap: 8, maxWidth: 300 },
  title: {
    fontFamily: FONTS.display,
    fontSize: TITLE_SIZE,
    lineHeight: TITLE_SIZE * 1.2,
    textAlign: 'center',
  },
  message: {
    fontFamily: FONTS.body,
    fontSize: TYPE.body,
    lineHeight: TYPE.body * 1.5,
    textAlign: 'center',
  },
  actions: { alignSelf: 'stretch', gap: SIZES.itemGap },
});
