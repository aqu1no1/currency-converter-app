import { z } from 'zod';

import { dateOnlySchema, dateTimeSchema } from './common.dto';

export const syncTypeSchema = z.enum(['DAILY', 'BACKFILL']);

export const syncRunStateSchema = z.enum(['RUNNING', 'SUCCESS', 'FAILED']);

export const syncRunStatusSchema = z.object({
  type: syncTypeSchema,
  status: syncRunStateSchema,
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

export type SyncRunState = z.infer<typeof syncRunStateSchema>;
