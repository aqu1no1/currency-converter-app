import '@lib/i18n';
import { setUpTests } from 'react-native-reanimated';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));

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
