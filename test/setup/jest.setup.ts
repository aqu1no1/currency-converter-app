import '@lib/i18n';
import { setUpTests } from 'react-native-reanimated';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => {
  const storage = jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  );

  return storage.default ?? storage;
});

jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));

jest.mock('@shopify/flash-list', () => {
  const { FlatList } = require('react-native');
  return { FlashList: FlatList };
});

setUpTests();

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageTag: 'pt-BR', languageCode: 'pt', regionCode: 'BR' }],
  getCalendars: () => [{ timeZone: 'America/Sao_Paulo' }],
}));

jest.mock('expo-font', () => ({
  ...jest.requireActual('expo-font'),
  isLoaded: () => true,
  loadAsync: () => Promise.resolve(),
}));

beforeEach(async () => {
  await mockAsyncStorage.clear();
});
