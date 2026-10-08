import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@constants/storage';
import { persistWelcomeCompletion } from '@utils/welcome.util';

/**
 * Lê e persiste se as boas-vindas já foram concluídas ou ignoradas.
 *
 * @example
 * ```tsx
 * const { isReady, shouldShowWelcome, markWelcomeCompleted } = useWelcomeGate();
 * ```
 */
export function useWelcomeGate() {
  const [shouldShowWelcome, setShouldShowWelcome] = useState(true);
  const [completedOnLoad, setCompletedOnLoad] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(STORAGE_KEYS.welcomeCompleted)
      .then((value) => {
        if (!mounted) return;

        const completed = value === 'true';
        setShouldShowWelcome(!completed);
        setCompletedOnLoad(completed);
        setIsReady(true);
      })
      .catch(() => {
        if (mounted) setIsReady(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const markWelcomeCompleted = useCallback(async () => {
    setShouldShowWelcome(false);
    await persistWelcomeCompletion();
  }, []);

  return { isReady, shouldShowWelcome, completedOnLoad, markWelcomeCompleted };
}
