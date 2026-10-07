import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageTag: 'pt-BR', languageCode: 'pt', regionCode: 'BR' }],
  getCalendars: () => [{ timeZone: 'America/Sao_Paulo' }],
}));

beforeEach(async () => {
  await mockAsyncStorage.clear();
});
