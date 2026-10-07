import { ExchangeRateService } from '@services/exchange-rate.service';
import { convertFixture, historyFixture, latestRatesFixture } from '@test/fixtures/api.fixtures';
import { createFakeApiService } from '@test/utils/fake-api.service';

describe('ExchangeRateService', () => {
  it('converts with /exchange-rates/convert and the amount as text', async () => {
    const api = createFakeApiService();
    api.get.mockResolvedValueOnce(convertFixture);
    const params = { from: 'EUR', to: 'BRL', amount: '100' };

    const result = await new ExchangeRateService(api).convert(params);

    expect(api.get).toHaveBeenCalledWith('/exchange-rates/convert', { params, signal: undefined });
    expect(result).toEqual(convertFixture);
  });

  it('gets the latest rates of a base currency', async () => {
    const api = createFakeApiService();
    api.get.mockResolvedValueOnce(latestRatesFixture);
    const signal = new AbortController().signal;

    const result = await new ExchangeRateService(api).latest('BRL', signal);

    expect(api.get).toHaveBeenCalledWith('/exchange-rates/latest/BRL', { signal });
    expect(result.rates.USD).toBe(0.188);
  });

  it('gets the history of a pair in a period', async () => {
    const api = createFakeApiService();
    api.get.mockResolvedValueOnce(historyFixture);
    const params = { from: 'USD', to: 'BRL', start: '2026-09-01', end: '2026-09-02' };

    const result = await new ExchangeRateService(api).history(params);

    expect(api.get).toHaveBeenCalledWith('/exchange-rates/history', { params, signal: undefined });
    expect(result.history).toHaveLength(2);
  });
});
