import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import { STORAGE_KEYS } from '@constants/storage';

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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(STORAGE_KEYS.welcomeCompleted)
      .then((value) => {
        if (!mounted) return;

        setShouldShowWelcome(value !== 'true');
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
    await AsyncStorage.setItem(STORAGE_KEYS.welcomeCompleted, 'true').catch(() => undefined);
  }, []);

  return { isReady, shouldShowWelcome, markWelcomeCompleted };
}
