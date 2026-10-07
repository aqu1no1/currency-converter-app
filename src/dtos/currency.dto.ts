import { z } from 'zod';

import { currencyCodeSchema, dateTimeSchema } from './common.dto';

export const currencySchema = z.object({
  id: z.uuid(),
  code: currencyCodeSchema,
  name: z.string(),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

export const currenciesSchema = z.array(currencySchema);

export type CurrencyDto = z.infer<typeof currencySchema>;
