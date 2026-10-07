import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Se o "reduzir movimento" do sistema está ligado.
 * Fica `null` até a primeira leitura, para nada animar antes de saber a resposta.
 */
export function useReduceMotion() {
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) setReduceMotion(enabled);
      })
      .catch(() => {
        if (mounted) setReduceMotion(false);
      });

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduceMotion;
}
