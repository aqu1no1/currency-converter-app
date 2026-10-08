import { fireEvent, screen } from '@testing-library/react-native';

import { ErrorState } from '@components/feedback/ErrorState';
import { renderWithProviders } from '@test/utils/render-with-providers';

describe('ErrorState', () => {
  it('shows the API error and a localized retry action', async () => {
    const onRetry = jest.fn();
    await renderWithProviders(<ErrorState error={new Error('Sem conexão')} onRetry={onRetry} />);

    expect(screen.getByText('Sem conexão')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Tentar de novo' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('can show an error without a retry action', async () => {
    await renderWithProviders(<ErrorState error="Falha ao carregar" />);

    expect(screen.getByText('Falha ao carregar')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
