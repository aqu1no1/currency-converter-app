import { convertSchema } from '@dtos/convert.dto';
import { currenciesSchema } from '@dtos/currency.dto';
import { historySchema } from '@dtos/history.dto';
import { latestRatesSchema } from '@dtos/latest-rates.dto';
import { syncRunsPageSchema } from '@dtos/sync-runs.dto';
import { syncStatusSchema } from '@dtos/sync-status.dto';
import {
  convertFixture,
  currenciesFixture,
  historyFixture,
  latestRatesFixture,
  syncRunsFixture,
  syncStatusFixture,
} from '@test/fixtures/api.fixtures';

describe('API DTOs', () => {
  it.each([
    ['currencies', currenciesSchema, currenciesFixture],
    ['convert', convertSchema, convertFixture],
    ['latest rates', latestRatesSchema, latestRatesFixture],
    ['history', historySchema, historyFixture],
    ['sync status', syncStatusSchema, syncStatusFixture],
    ['sync runs', syncRunsPageSchema, syncRunsFixture],
  ] as const)('accepts a real %s response', (_, schema, fixture) => {
    expect(schema.safeParse(fixture).success).toBe(true);
  });

  it('rejects a currency code that is not 3 uppercase letters', () => {
    expect(currenciesSchema.safeParse([{ ...currenciesFixture[0], code: 'usd' }]).success).toBe(
      false,
    );
  });

  it('rejects a date that is not AAAA-MM-DD', () => {
    expect(convertSchema.safeParse({ ...convertFixture, date: '28/09/2026' }).success).toBe(false);
  });

  it('rejects a rate sent as text', () => {
    expect(
      latestRatesSchema.safeParse({ ...latestRatesFixture, rates: { USD: '0.18' } }).success,
    ).toBe(false);
  });

  it('rejects an unknown sync status', () => {
    const lastRun = { ...syncStatusFixture.lastRun, status: 'PAUSED' };

    expect(syncStatusSchema.safeParse({ ...syncStatusFixture, lastRun }).success).toBe(false);
  });

  it('accepts an empty history', () => {
    expect(historySchema.safeParse({ from: 'USD', to: 'BRL', history: [] }).success).toBe(true);
  });
});
