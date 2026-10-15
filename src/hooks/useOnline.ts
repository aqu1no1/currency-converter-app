import { onlineManager } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';

const subscribe = (onChange: () => void) => onlineManager.subscribe(onChange);
const getSnapshot = () => onlineManager.isOnline();

/**
 * Diz se o aparelho está com internet, pelo `onlineManager` do TanStack Query.
 *
 * O `onlineManager` é alimentado pelo NetInfo (`setupOnlineManager`), então o valor
 * muda sozinho quando a conexão cai ou volta.
 *
 * @example
 * ```tsx
 * const online = useOnline();
 * if (!online && latest.data) return <StatusBanner message={...} />;
 * ```
 */
export function useOnline(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
