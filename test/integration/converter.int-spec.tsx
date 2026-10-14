import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';

import Converter from '@app/(tabs)/converter';
import { createFakeApiService } from '@test/utils/fake-api.service';
import { renderWithProviders } from '@test/utils/render-with-providers';

const LATEST = {
  BRL: {
    base: 'BRL',
    date: '2026-09-28',
    rates: {
      USD: 0.192566,
      EUR: 0.169741,
      GBP: 0.145128,
      JPY: 30.32,
      CAD: 0.265939,
      AUD: 0.293472,
      CHF: 0.154439,
      CNY: 1.37204,
      ARS: 279.664,
    },
  },
  EUR: {
    base: 'EUR',
    date: '2026-09-28',
    rates: {
      USD: 1.13999,
      BRL: 5.9131,
      GBP: 0.85272,
      JPY: 179.52,
      CAD: 1.5743,
      AUD: 1.7373,
      CHF: 0.91425,
      CNY: 8.1225,
      ARS: 1655.6,
    },
  },
} as const;

function createApi() {
  const api = createFakeApiService();
  api.get.mockImplementation(async (url) => {
    const base = url.split('/').at(-1) as keyof typeof LATEST;
    if (url.includes('/exchange-rates/latest/') && LATEST[base]) return LATEST[base];
    throw new Error(`Unexpected API path: ${url}`);
  });
  return api;
}

function press(name: string) {
  fireEvent.press(screen.getByRole('button', { name }));
}

describe('Converter screen', () => {
  it('converts 100 from the primary currency into the other currencies', async () => {
    await renderWithProviders(<Converter />, { api: createApi() });

    expect(await screen.findByText('€ 16,97')).toBeTruthy();
    expect(screen.getByText('R$ 100')).toBeTruthy();
    expect(screen.getByText('Cotação de 28/09/2026')).toBeTruthy();
    expect(screen.getByText('1 BRL = 0,1697 EUR')).toBeTruthy();
    expect(screen.getByText('JP¥ 3.032')).toBeTruthy();
  });

  it('updates the values while typing without calling the API again', async () => {
    const api = createApi();
    await renderWithProviders(<Converter />, { api });
    await screen.findByText('€ 16,97');
    const calls = api.get.mock.calls.length;

    press('Limpar');
    press('2');
    press('5');
    press('Vírgula');
    press('5');

    expect(screen.getByText('R$ 25,5')).toBeTruthy();
    expect(screen.getByText('€ 4,33')).toBeTruthy();

    press('Apagar');
    press('Somar mil');

    expect(screen.getByText('R$ 1.025')).toBeTruthy();
    expect(api.get).toHaveBeenCalledTimes(calls);
  });

  it('converts from a currency when its row is tapped', async () => {
    const api = createApi();
    await renderWithProviders(<Converter />, { api });
    await screen.findByText('€ 16,97');

    await act(async () => {
      press('Euro: € 16,97. Converter a partir de EUR');
    });

    expect(screen.getByText('€ 16,97')).toBeTruthy();
    await waitFor(() =>
      expect(api.get).toHaveBeenCalledWith('/exchange-rates/latest/EUR', expect.anything()),
    );
    expect(await screen.findByText('1 EUR = 5,9131 BRL')).toBeTruthy();
    expect(screen.getByText('R$ 100,35')).toBeTruthy();
  });

  it('shows a retry action when the rates cannot be loaded', async () => {
    const api = createFakeApiService();
    api.get.mockRejectedValue(new Error('offline'));
    await renderWithProviders(<Converter />, { api });

    expect(await screen.findByText('offline')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeTruthy();
  });
});
