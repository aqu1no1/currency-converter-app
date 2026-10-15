import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';

import Settings from '@app/(tabs)/settings';
import { STORAGE_KEYS } from '@constants/storage';
import { ApiError } from '@interfaces/api-error.interface';
import { setLanguage } from '@lib/i18n';
import { currenciesFixture, syncRunsFixture } from '@test/fixtures/api.fixtures';
import { createFakeApiService } from '@test/utils/fake-api.service';
import { renderWithProviders } from '@test/utils/render-with-providers';

const FAILED_STATUS = {
  lastRun: {
    type: 'DAILY',
    status: 'FAILED',
    startedAt: '2026-09-29T09:00:00.000Z',
    finishedAt: '2026-09-29T09:00:10.000Z',
    rowsInserted: 0,
    error: 'timeout no provedor',
  },
  latestRateDate: '2026-09-28',
};

function createApi(status: unknown = FAILED_STATUS) {
  const api = createFakeApiService();
  api.get.mockImplementation(async (url) => {
    if (url === '/sync/status') return status;
    if (url === '/sync') return syncRunsFixture;
    if (url === '/currencies') return currenciesFixture;
    throw new Error(`Unexpected API path: ${url}`);
  });
  return api;
}

describe('Settings screen', () => {
  afterEach(async () => {
    await act(async () => setLanguage('pt-BR'));
  });

  it('shows the failed last run with its own label and the recent runs', async () => {
    await renderWithProviders(<Settings />, { api: createApi() });

    expect(await screen.findByText('Última execução')).toBeTruthy();
    expect(screen.getAllByText('Falhou').length).toBeGreaterThan(0);
    expect(screen.getByText('29/09/2026 às 06:00 · timeout no provedor')).toBeTruthy();
    expect(screen.getByText('Diária · timeout no provedor')).toBeTruthy();
    expect(screen.getByText('28/09/2026')).toBeTruthy();
    expect(screen.getByText('01/01/2000')).toBeTruthy();
    expect(await screen.findByText('Diária · 45 linhas em 2 s')).toBeTruthy();
    expect(screen.getAllByText('Sucesso').length).toBeGreaterThan(0);
  });

  it('changes the language and the screen texts right away', async () => {
    await renderWithProviders(<Settings />, { api: createApi() });

    fireEvent.press(screen.getByRole('button', { name: 'Idioma: Português. Alterar' }));
    fireEvent.press(await screen.findByRole('radio', { name: 'English' }));

    expect(await screen.findByText('Settings')).toBeTruthy();
    expect(screen.getByText('Preferences')).toBeTruthy();
    await waitFor(async () => expect(await AsyncStorage.getItem(STORAGE_KEYS.language)).toBe('en'));
  });

  it('changes the primary currency and the theme', async () => {
    await renderWithProviders(<Settings />, { api: createApi() });

    fireEvent.press(screen.getByRole('button', { name: /Moeda principal: .*\. Alterar/ }));
    fireEvent.press(await screen.findByRole('radio', { name: 'Euro (EUR)' }));
    expect(await screen.findByText('EUR')).toBeTruthy();

    fireEvent.press(screen.getByRole('radio', { name: 'Escuro' }));
    expect(screen.getByRole('radio', { name: 'Escuro' })).toBeChecked();
    await waitFor(async () => expect(await AsyncStorage.getItem(STORAGE_KEYS.theme)).toBe('dark'));
  });

  it('keeps the preferences usable when the sync status cannot be loaded', async () => {
    const api = createApi();
    api.get.mockRejectedValue(new ApiError({ status: 500, message: 'down' }));
    await renderWithProviders(<Settings />, { api });

    expect(await screen.findByText('Não foi possível carregar as cotações')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Tentar' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Automático' })).toBeChecked();
  });
});
