import { z } from 'zod';

import { currencyCodeSchema, dateOnlySchema } from './common.dto';

export const convertSchema = z.object({
  from: currencyCodeSchema,
  to: currencyCodeSchema,
  amount: z.number().nonnegative(),
  rate: z.number().positive(),
  result: z.number().nonnegative(),
  date: dateOnlySchema,
});

export type ConvertDto = z.infer<typeof convertSchema>;

export type ConvertParams = {
  from: string;
  to: string;
  amount: string;
};
