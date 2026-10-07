import { z } from 'zod';

import { dateOnlySchema, dateTimeSchema } from './common.dto';

export const syncRunStatusSchema = z.object({
  type: z.enum(['DAILY', 'BACKFILL']),
  status: z.enum(['RUNNING', 'SUCCESS', 'FAILED']),
  startedAt: dateTimeSchema,
  finishedAt: dateTimeSchema.nullable(),
  rowsInserted: z.number().int().nonnegative(),
  error: z.string().nullable(),
});

export const syncStatusSchema = z.object({
  lastRun: syncRunStatusSchema.nullable(),
  latestRateDate: dateOnlySchema.nullable(),
});

export type SyncRunStatusDto = z.infer<typeof syncRunStatusSchema>;

export type SyncStatusDto = z.infer<typeof syncStatusSchema>;
