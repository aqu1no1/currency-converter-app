import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

export function setupOnlineManager(): void {
  onlineManager.setEventListener((setOnline) =>
    NetInfo.addEventListener((state) => setOnline(state.isConnected !== false)),
  );
}
