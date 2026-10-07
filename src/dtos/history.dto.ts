import { z } from 'zod';

import { currencyCodeSchema, dateOnlySchema } from './common.dto';

export const historyItemSchema = z.object({
  date: dateOnlySchema,
  rate: z.number().positive(),
});

export const historySchema = z.object({
  from: currencyCodeSchema,
  to: currencyCodeSchema,
  history: z.array(historyItemSchema),
});

export type HistoryItemDto = z.infer<typeof historyItemSchema>;

export type HistoryDto = z.infer<typeof historySchema>;

export type HistoryParams = {
  from: string;
  to: string;
  start: string;
  end: string;
};
