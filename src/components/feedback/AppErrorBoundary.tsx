import { type ErrorBoundaryProps, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FullScreenError } from '@components/feedback/FullScreenError';
import { APP_ROUTES } from '@constants/routes.constants';

/**
 * Tela "Algo deu errado" usada como `ErrorBoundary` do expo-router.
 *
 * Aparece quando uma tela quebra ao renderizar. "Tentar de novo" remonta a tela que
 * falhou; "Voltar ao início" leva para a aba Início e também limpa o erro.
 *
 * @example
 * ```tsx
 * export function ErrorBoundary(props: ErrorBoundaryProps) {
 *   return <AppErrorBoundary {...props} />;
 * }
 * ```
 */
export function AppErrorBoundary({ retry }: ErrorBoundaryProps) {
  const { t } = useTranslation();
  const { replace } = useRouter();

  const goHome = () => {
    replace(APP_ROUTES.home);
    void retry();
  };

  return (
    <FullScreenError
      label={t('errors.fatal.label')}
      title={t('errors.fatal.title')}
      message={t('errors.fatal.body')}
      primaryAction={{ label: t('errors.fatal.goHome'), icon: 'home', onPress: goHome }}
      secondaryAction={{ label: t('errors.fatal.retry'), onPress: () => void retry() }}
    />
  );
}
