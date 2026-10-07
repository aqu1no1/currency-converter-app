import type { z } from 'zod';

import { ApiError } from '@interfaces/api-error.interface';
import { i18n } from '@lib/i18n';

export function parseResponse<TSchema extends z.ZodType>(
  schema: TSchema,
  data: unknown,
): z.infer<TSchema> {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    throw new ApiError({
      status: 0,
      message: i18n.t('errors.invalidResponse'),
      code: 'INVALID_RESPONSE',
    });
  }

  return parsed.data;
}
