import { useCallback } from 'react';
import { useRouter } from 'expo-router';

import { APP_ROUTES } from '@constants/routes.constants';
import { persistWelcomeCompletion } from '@utils/welcome.util';
/**
 * Persists onboarding completion and replaces the current route with Home.
 * Persiste a conclusão do onboarding e substitui a rota atual pela tela Início.
 */

export function useCompleteOnboarding() {
  const { replace } = useRouter();

  return useCallback(async () => {
    await persistWelcomeCompletion();
    replace(APP_ROUTES.home);
  }, [replace]);
}
