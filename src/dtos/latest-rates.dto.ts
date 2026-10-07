import { z } from 'zod';

import { currencyCodeSchema, dateOnlySchema } from './common.dto';

export const latestRatesSchema = z.object({
  base: currencyCodeSchema,
  date: dateOnlySchema,
  rates: z.record(currencyCodeSchema, z.number().positive()),
});

export type LatestRatesDto = z.infer<typeof latestRatesSchema>;
