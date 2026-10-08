import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@constants/storage';

export async function persistWelcomeCompletion() {
  await AsyncStorage.setItem(STORAGE_KEYS.welcomeCompleted, 'true').catch(() => undefined);
}
