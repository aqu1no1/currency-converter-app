import { onlineManager } from '@tanstack/react-query';

import { ApiError } from '@interfaces/api-error.interface';

export type ErrorKind = 'offline' | 'timeout' | 'server' | 'notReady' | 'notFound' | 'unknown';

export const TIMEOUT_CODES = new Set(['ECONNABORTED', 'ETIMEDOUT']);
const NOT_READY_STATUS = 503;
const NOT_FOUND_STATUS = 404;

export function getErrorKind(error: unknown): ErrorKind {
  if (!(error instanceof ApiError)) return 'unknown';

  if (error.isNetwork) {
    if (TIMEOUT_CODES.has(error.code ?? '')) return 'timeout';
    return onlineManager.isOnline() ? 'server' : 'offline';
  }
  if (error.status === NOT_READY_STATUS) return 'notReady';
  if (error.status === NOT_FOUND_STATUS) return 'notFound';
  if (error.isServerError) return 'server';

  return 'unknown';
}

type QueryErrorState = { isError: boolean; error: unknown };

export function getMissingDataKind(online: boolean, query: QueryErrorState): ErrorKind | undefined {
  if (!online) return 'offline';
  if (query.isError) return getErrorKind(query.error);
  return undefined;
}
