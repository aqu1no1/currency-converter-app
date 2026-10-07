import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageTag: 'pt-BR', languageCode: 'pt', regionCode: 'BR' }],
  getCalendars: () => [{ timeZone: 'America/Sao_Paulo' }],
}));

// As fontes dos ícones contam como carregadas: sem isso o @expo/vector-icons
// atualiza o estado depois do render e o teste avisa sobre act(...).
jest.mock('expo-font', () => ({
  ...jest.requireActual('expo-font'),
  isLoaded: () => true,
  loadAsync: () => Promise.resolve(),
}));

beforeEach(async () => {
  await mockAsyncStorage.clear();
});
