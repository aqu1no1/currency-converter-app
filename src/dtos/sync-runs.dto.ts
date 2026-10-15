import { z } from 'zod';

import { dateTimeSchema } from './common.dto';
import { syncRunStateSchema, syncTypeSchema } from './sync-status.dto';

export const syncRunSchema = z.object({
  id: z.uuid(),
  type: syncTypeSchema,
  status: syncRunStateSchema,
  startedAt: dateTimeSchema,
  finishedAt: dateTimeSchema.nullish(),
  rowsInserted: z.number().int().nonnegative(),
  errorMessage: z.string().nullish(),
});

export const syncRunsPageSchema = z.object({
  data: z.array(syncRunSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  perPage: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
});

export type SyncRunDto = z.infer<typeof syncRunSchema>;

export type SyncRunsPageDto = z.infer<typeof syncRunsPageSchema>;
