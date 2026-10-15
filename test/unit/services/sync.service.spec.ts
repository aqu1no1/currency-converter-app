import { SyncService } from '@services/sync.service';
import { syncRunsFixture, syncStatusFixture } from '@test/fixtures/api.fixtures';
import { createFakeApiService } from '@test/utils/fake-api.service';

describe('SyncService', () => {
  it('gets the sync status from /sync/status', async () => {
    const api = createFakeApiService();
    api.get.mockResolvedValueOnce(syncStatusFixture);

    const status = await new SyncService(api).status();

    expect(api.get).toHaveBeenCalledWith('/sync/status', { signal: undefined });
    expect(status.latestRateDate).toBe('2026-09-28');
  });

  it('accepts a status before the first sync', async () => {
    const api = createFakeApiService();
    api.get.mockResolvedValueOnce({ lastRun: null, latestRateDate: null });

    await expect(new SyncService(api).status()).resolves.toEqual({
      lastRun: null,
      latestRateDate: null,
    });
  });

  it('lists the latest runs from /sync with pagination', async () => {
    const api = createFakeApiService();
    api.get.mockResolvedValueOnce(syncRunsFixture);

    const page = await new SyncService(api).list({ perPage: 4 });

    expect(api.get).toHaveBeenCalledWith('/sync', { params: { perPage: 4 }, signal: undefined });
    expect(page.data).toHaveLength(3);
    expect(page.data[1]?.status).toBe('FAILED');
  });
});
