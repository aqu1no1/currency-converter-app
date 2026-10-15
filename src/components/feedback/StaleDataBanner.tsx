import { useTranslation } from 'react-i18next';

import { StatusBanner } from '@components/feedback/StatusBanner';
import { useOnline } from '@hooks/useOnline';
import { formatDate } from '@utils/format.util';

interface StaleDataBannerProps {
  /** Data das cotações que a tela está mostrando (`AAAA-MM-DD`). */
  date: string;
  /** Se a última tentativa de atualizar falhou. */
  failed: boolean;
  /** Tenta buscar de novo, normalmente o `refetch` da consulta. */
  onRetry: () => void;
}

/**
 * Aviso para quando a tela mostra cotações salvas em vez de dados novos.
 *
 * Sem internet, avisa que são as cotações salvas; com internet, mas com a atualização
 * falhando, avisa que não foi possível atualizar. Nos outros casos não mostra nada,
 * então some sozinho quando a conexão volta e a busca dá certo.
 *
 * @example
 * ```tsx
 * <StaleDataBanner
 *   date={latest.data.date}
 *   failed={latest.isError}
 *   onRetry={() => void latest.refetch()}
 * />
 * ```
 */
export function StaleDataBanner({ date, failed, onRetry }: StaleDataBannerProps) {
  const { t } = useTranslation();
  const online = useOnline();

  if (online && !failed) return null;

  return (
    <StatusBanner
      icon={online ? 'syncAlert' : 'offline'}
      message={t(online ? 'errors.staleBanner' : 'errors.offlineBanner', {
        date: formatDate(date),
      })}
      action={{ label: t('errors.bannerRetry'), onPress: onRetry }}
    />
  );
}
