import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@constants/storage';
import { persistWelcomeCompletion } from '@utils/welcome.util';

/**
 * Controla se a tela de Boas-vindas deve aparecer.
 *
 * Lê do aparelho se as Boas-vindas já foram concluídas. `completedOnLoad` indica
 * que o app deve ir direto ao Início; `markWelcomeCompleted` salva a conclusão
 * (por exemplo, ao tocar em "Converter agora").
 *
 * @example
 * ```tsx
 * const { isReady, shouldShowWelcome, completedOnLoad, markWelcomeCompleted } = useWelcomeGate();
 * ```
 */
export function useWelcomeGate() {
  const [shouldShowWelcome, setShouldShowWelcome] = useState(true);
  const [completedOnLoad, setCompletedOnLoad] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const markWelcomeCompleted = useCallback(async () => {
    setShouldShowWelcome(false);
    await persistWelcomeCompletion();
  }, []);

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

  return { isReady, shouldShowWelcome, completedOnLoad, markWelcomeCompleted };
}
