import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@constants/storage';
import { persistWelcomeCompletion } from '@utils/welcome.util';
/**
 * Loads, exposes, and persists whether the welcome screen has been completed.
 * Carrega, expõe e persiste se a tela de boas-vindas já foi concluída.
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
