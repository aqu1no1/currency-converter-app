import { useCallback } from 'react';
import { useRouter } from 'expo-router';

import { APP_ROUTES } from '@constants/routes.constants';
import { persistWelcomeCompletion } from '@utils/welcome.util';

/**
 * Conclui o onboarding e leva para o Início.
 *
 * Salva que as Boas-vindas e o onboarding já foram vistos e troca a rota com
 * `replace`, para o "voltar" do Android não reabrir o onboarding.
 *
 * @example
 * ```tsx
 * const completeOnboarding = useCompleteOnboarding();
 * <OnboardingHeader step={1} onSkip={() => void completeOnboarding()} />
 * ```
 */
export function useCompleteOnboarding() {
  const { replace } = useRouter();

  return useCallback(async () => {
    await persistWelcomeCompletion();
    replace(APP_ROUTES.home);
  }, [replace]);
}
