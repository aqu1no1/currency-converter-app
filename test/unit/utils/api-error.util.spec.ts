import { onlineManager } from '@tanstack/react-query';

import { ApiError } from '@interfaces/api-error.interface';
import { getErrorKind, getMissingDataKind } from '@utils/api-error.util';

describe('api error util', () => {
  afterEach(() => onlineManager.setOnline(true));

  it('maps API errors to a single kind', () => {
    expect(getErrorKind(new ApiError({ status: 503, message: '' }))).toBe('notReady');
    expect(getErrorKind(new ApiError({ status: 500, message: '' }))).toBe('server');
    expect(getErrorKind(new ApiError({ status: 404, message: '' }))).toBe('notFound');
    expect(getErrorKind(new ApiError({ status: 400, message: '' }))).toBe('unknown');
    expect(getErrorKind(new Error('boom'))).toBe('unknown');
  });

  it('tells timeouts from unreachable servers and from being offline', () => {
    const timeout = new ApiError({ status: 0, message: '', code: 'ECONNABORTED', isNetwork: true });
    const network = new ApiError({ status: 0, message: '', code: 'ERR_NETWORK', isNetwork: true });

    expect(getErrorKind(timeout)).toBe('timeout');
    expect(getErrorKind(network)).toBe('server');

    onlineManager.setOnline(false);
    expect(getErrorKind(network)).toBe('offline');
  });

  it('explains missing data by the connection first, then by the error', () => {
    const server = { isError: true, error: new ApiError({ status: 500, message: '' }) };

    expect(getMissingDataKind(false, server)).toBe('offline');
    expect(getMissingDataKind(true, server)).toBe('server');
    expect(getMissingDataKind(true, { isError: false, error: null })).toBeUndefined();
  });
});
