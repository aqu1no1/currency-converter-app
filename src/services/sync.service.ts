import { type SyncRunsPageDto, syncRunsPageSchema } from '@dtos/sync-runs.dto';
import { type SyncStatusDto, syncStatusSchema } from '@dtos/sync-status.dto';
import type { HttpClient } from '@interfaces/http-client.interface';
import { parseResponse } from '@utils/parse-response.util';

export type SyncRunsParams = {
  page?: number;
  perPage?: number;
};

export class SyncService {
  private readonly baseUrl = '/sync';

  constructor(private readonly api: HttpClient) {}

  async status(signal?: AbortSignal): Promise<SyncStatusDto> {
    const data = await this.api.get(`${this.baseUrl}/status`, { signal });
    return parseResponse(syncStatusSchema, data);
  }

  async list(params: SyncRunsParams = {}, signal?: AbortSignal): Promise<SyncRunsPageDto> {
    const data = await this.api.get(this.baseUrl, { params, signal });
    return parseResponse(syncRunsPageSchema, data);
  }
}
