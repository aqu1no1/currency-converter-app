import { ApiError } from '@interfaces/api-error.interface';
import { CurrencyService } from '@services/currency.service';
import { currenciesFixture } from '@test/fixtures/api.fixtures';
import { createFakeApiService } from '@test/utils/fake-api.service';

describe('CurrencyService', () => {
  it('lists the currencies from /currencies', async () => {
    const api = createFakeApiService();
    api.get.mockResolvedValueOnce(currenciesFixture);
    const signal = new AbortController().signal;

    const currencies = await new CurrencyService(api).list(signal);

    expect(api.get).toHaveBeenCalledWith('/currencies', { signal });
    expect(currencies.map((currency) => currency.code)).toEqual(['USD', 'BRL']);
  });

  it('rejects a response in an unexpected shape', async () => {
    const api = createFakeApiService();
    api.get.mockResolvedValueOnce([{ code: 'USD' }]);

    await expect(new CurrencyService(api).list()).rejects.toMatchObject({
      code: 'INVALID_RESPONSE',
    });
  });

  it('passes the api errors through', async () => {
    const api = createFakeApiService();
    const error = new ApiError({ status: 0, message: 'offline', isNetwork: true });
    api.get.mockRejectedValueOnce(error);

    await expect(new CurrencyService(api).list()).rejects.toBe(error);
  });
});
