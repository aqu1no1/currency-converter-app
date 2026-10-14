import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Informa se o "reduzir movimento" do sistema está ligado.
 *
 * Retorna `null` enquanto a preferência ainda não foi lida, e acompanha mudanças
 * feitas com o app aberto. As animações só devem rodar quando o valor for `false`.
 *
 * @example
 * ```tsx
 * const reduceMotion = useReduceMotion();
 * const animate = reduceMotion === false;
 * ```
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
