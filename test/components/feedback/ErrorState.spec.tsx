import { fireEvent, screen } from '@testing-library/react-native';

import { ErrorState } from '@components/feedback/ErrorState';
import { ApiError } from '@interfaces/api-error.interface';
import { renderWithProviders } from '@test/utils/render-with-providers';

describe('ErrorState', () => {
  it('shows the unavailable state with retry and sync status for server errors', async () => {
    const onRetry = jest.fn();
    const onOpenSyncStatus = jest.fn();
    await renderWithProviders(
      <ErrorState
        error={new ApiError({ status: 500, message: 'down' })}
        onRetry={onRetry}
        onOpenSyncStatus={onOpenSyncStatus}
      />,
    );

    expect(screen.getByText('Não foi possível carregar as cotações')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Tentar de novo' }));
    fireEvent.press(screen.getByRole('button', { name: 'Ver status da sincronização' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onOpenSyncStatus).toHaveBeenCalledTimes(1);
  });

  it('shows the rates on the way state for 503', async () => {
    await renderWithProviders(
      <ErrorState
        error={new ApiError({ status: 503, message: 'not ready' })}
        onRetry={jest.fn()}
        onOpenSyncStatus={jest.fn()}
      />,
    );

    expect(screen.getByText('As cotações estão a caminho')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Atualizar' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Ver status da sincronização' })).toBeNull();
  });

  it('shows the offline state from the kind', async () => {
    await renderWithProviders(<ErrorState kind="offline" onRetry={jest.fn()} />);

    expect(screen.getByText('Sem conexão com a internet')).toBeTruthy();
  });

  it('can show an error without actions', async () => {
    await renderWithProviders(<ErrorState error={new Error('boom')} />);

    expect(screen.getByText('Algo deu errado')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
