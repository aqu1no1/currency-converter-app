import { useCallback } from 'react';
import { useRouter } from 'expo-router';

import { APP_ROUTES } from '@constants/routes.constants';
import { persistWelcomeCompletion } from '@utils/welcome.util';

/**
 * Marks the onboarding complete and replaces the current route with Home.
 *
 * @example
 * ```tsx
 * const completeOnboarding = useCompleteOnboarding();
 * <Button onPress={() => void completeOnboarding()}>...</Button>
 * ```
 */
export function useCompleteOnboarding() {
  const { replace } = useRouter();

  return useCallback(async () => {
    await persistWelcomeCompletion();
    replace(APP_ROUTES.home);
  }, [replace]);
}
