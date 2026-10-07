import type { ReactNode } from 'react';

import { renderHook } from '@testing-library/react-native';

import { ApiProvider, useApi } from '@contexts/ApiProvider';
import { ApiService } from '@services/api.service';
import { createFakeApiService } from '@test/utils/fake-api.service';

describe('ApiProvider', () => {
  it('gives the shared ApiService by default', () => {
    const { result } = renderHook(() => useApi(), { wrapper: ApiProvider });

    expect(result.current).toBe(ApiService.getInstance());
  });

  it('gives the api passed by prop', () => {
    const api = createFakeApiService();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ApiProvider api={api}>{children}</ApiProvider>
    );

    const { result } = renderHook(() => useApi(), { wrapper });

    expect(result.current).toBe(api);
  });

  it('throws when used outside the provider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useApi())).toThrow('useApi precisa estar dentro do ApiProvider');
  });
});
