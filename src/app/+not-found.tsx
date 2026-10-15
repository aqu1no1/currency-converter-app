import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FullScreenError } from '@components/feedback/FullScreenError';
import { APP_ROUTES } from '@constants/routes.constants';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const { replace } = useRouter();

  const goHome = () => replace(APP_ROUTES.home);

  return (
    <FullScreenError
      label={t('errors.notFound.label')}
      title={t('errors.notFound.title')}
      message={t('errors.notFound.body')}
      primaryAction={{ label: t('errors.notFound.goHome'), icon: 'home', onPress: goHome }}
    />
  );
}
