import { Text } from 'react-native';

import { useQueryClient } from '@tanstack/react-query';
import { screen } from '@testing-library/react-native';

import { renderWithProviders } from './render-with-providers';

function Probe() {
  const client = useQueryClient();
  return <Text>{client ? 'with query client' : 'without query client'}</Text>;
}

describe('renderWithProviders', () => {
  it('wraps the tree with a QueryClientProvider', () => {
    renderWithProviders(<Probe />);
    expect(screen.getByText('with query client')).toBeTruthy();
  });
});
