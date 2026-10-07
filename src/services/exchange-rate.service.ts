import { type ConvertDto, type ConvertParams, convertSchema } from '@dtos/convert.dto';
import { type HistoryDto, type HistoryParams, historySchema } from '@dtos/history.dto';
import { type LatestRatesDto, latestRatesSchema } from '@dtos/latest-rates.dto';
import type { HttpClient } from '@interfaces/http-client.interface';
import { parseResponse } from '@utils/parse-response.util';

export class ExchangeRateService {
  private readonly baseUrl = '/exchange-rates';

  constructor(private readonly api: HttpClient) {}

  async convert(params: ConvertParams, signal?: AbortSignal): Promise<ConvertDto> {
    const data = await this.api.get(`${this.baseUrl}/convert`, { params, signal });
    return parseResponse(convertSchema, data);
  }

  async latest(base: string, signal?: AbortSignal): Promise<LatestRatesDto> {
    const data = await this.api.get(`${this.baseUrl}/latest/${encodeURIComponent(base)}`, {
      signal,
    });
    return parseResponse(latestRatesSchema, data);
  }

  async history(params: HistoryParams, signal?: AbortSignal): Promise<HistoryDto> {
    const data = await this.api.get(`${this.baseUrl}/history`, { params, signal });
    return parseResponse(historySchema, data);
  }
}
