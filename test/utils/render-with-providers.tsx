import type { ReactElement, ReactNode } from 'react';

import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react-native';

import { createTestQueryClient } from './query-client';

interface ProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  { queryClient = createTestQueryClient(), ...options }: ProvidersOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return { queryClient, ...render(ui, { wrapper: Wrapper, ...options }) };
}
