import { type SyncStatusDto, syncStatusSchema } from '@dtos/sync-status.dto';
import type { HttpClient } from '@interfaces/http-client.interface';
import { parseResponse } from '@utils/parse-response.util';

export class SyncService {
  private readonly baseUrl = '/sync';

  constructor(private readonly api: HttpClient) {}

  async status(signal?: AbortSignal): Promise<SyncStatusDto> {
    const data = await this.api.get(`${this.baseUrl}/status`, { signal });
    return parseResponse(syncStatusSchema, data);
  }
}
