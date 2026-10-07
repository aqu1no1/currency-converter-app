import { type CurrencyDto, currenciesSchema } from '@dtos/currency.dto';
import type { HttpClient } from '@interfaces/http-client.interface';
import { parseResponse } from '@utils/parse-response.util';

export class CurrencyService {
  private readonly baseUrl = '/currencies';

  constructor(private readonly api: HttpClient) {}

  async list(signal?: AbortSignal): Promise<CurrencyDto[]> {
    const data = await this.api.get(this.baseUrl, { signal });
    return parseResponse(currenciesSchema, data);
  }
}
