import { onlineManager } from '@tanstack/react-query';
import { act, screen, waitFor } from '@testing-library/react-native';

import Rates from '@app/(tabs)/rates';
import { latestRatesQueryKey } from '@hooks/useLatestRates';
import { createFakeApiService } from '@test/utils/fake-api.service';
import { createTestQueryClient } from '@test/utils/query-client';
import { renderWithProviders } from '@test/utils/render-with-providers';

const SAVED = {
  base: 'BRL',
  date: '2026-09-28',
  rates: { USD: 0.192566, EUR: 0.169741 },
} as const;

function createApi() {
  const api = createFakeApiService();
  api.get.mockResolvedValue({ ...SAVED, date: '2026-09-29' });
  return api;
}

describe('Offline states', () => {
  afterEach(async () => {
    await act(async () => onlineManager.setOnline(true));
  });

  it('keeps showing the saved rates with a warning and refetches when back online', async () => {
    const api = createApi();
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(latestRatesQueryKey('BRL'), SAVED);
    onlineManager.setOnline(false);

    await renderWithProviders(<Rates />, { api, queryClient });

    expect(
      await screen.findByText('Sem conexão. Mostrando as cotações salvas de 28/09/2026.'),
    ).toBeTruthy();
    expect(screen.getByText('Dólar americano')).toBeTruthy();
    expect(api.get).not.toHaveBeenCalled();

    await act(async () => onlineManager.setOnline(true));

    await waitFor(() => expect(screen.getByText('Cotações de 29/09/2026')).toBeTruthy());
    expect(screen.queryByText(/Sem conexão/)).toBeNull();
  });

  it('shows the offline state when nothing was saved', async () => {
    const api = createApi();
    onlineManager.setOnline(false);

    await renderWithProviders(<Rates />, { api });

    expect(await screen.findByText('Sem conexão com a internet')).toBeTruthy();
    expect(screen.getByText('Sem conexão')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeTruthy();
    expect(api.get).not.toHaveBeenCalled();
  });
});
