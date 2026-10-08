import { waitFor } from '@testing-library/react-native';

import { useLatestRates } from '@hooks/useLatestRates';
import { latestRatesFixture } from '@test/fixtures/api.fixtures';
import { createFakeApiService } from '@test/utils/fake-api.service';
import { renderHookWithProviders } from '@test/utils/render-with-providers';

async function renderLatestRates(base: string, api = createFakeApiService()) {
  return renderHookWithProviders(({ code }: { code: string }) => useLatestRates(code), {
    api,
    initialProps: { code: base },
  });
}

describe('useLatestRates', () => {
  it('returns the latest rates of the base currency from the api in the provider', async () => {
    const api = createFakeApiService();
    api.get.mockResolvedValueOnce(latestRatesFixture);

    const { result } = await renderLatestRates('BRL', api);

    await waitFor(() => expect(result.current.data).toEqual(latestRatesFixture));
    expect(api.get).toHaveBeenCalledWith('/exchange-rates/latest/BRL', {
      signal: expect.any(AbortSignal),
    });
  });

  it('cancels the previous request when the base changes before the response', async () => {
    const api = createFakeApiService();
    const signals: AbortSignal[] = [];
    api.get.mockImplementation(
      (url, options) =>
        new Promise((resolve) => {
          signals.push(options!.signal!);
          if (url.endsWith('/USD')) resolve({ ...latestRatesFixture, base: 'USD' });
        }),
    );

    const { result, rerender } = await renderLatestRates('BRL', api);
    await waitFor(() => expect(signals).toHaveLength(1));

    rerender({ code: 'USD' });

    await waitFor(() => expect(result.current.data?.base).toBe('USD'));
    expect(signals[0]!.aborted).toBe(true);
    expect(signals[1]!.aborted).toBe(false);
  });
});
