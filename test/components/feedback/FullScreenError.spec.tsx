import { fireEvent, screen } from '@testing-library/react-native';

import NotFoundScreen from '@app/+not-found';
import { AppErrorBoundary } from '@components/feedback/AppErrorBoundary';
import { renderWithProviders } from '@test/utils/render-with-providers';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useRouter: () => ({ replace: mockReplace }),
}));

describe('Full screen errors', () => {
  beforeEach(() => mockReplace.mockClear());

  it('lets the user retry or go home after an unexpected error', async () => {
    const retry = jest.fn(() => Promise.resolve());
    await renderWithProviders(<AppErrorBoundary error={new Error('boom')} retry={retry} />);

    expect(screen.getByText('Erro inesperado')).toBeTruthy();
    expect(screen.getByText('Algo deu errado')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Tentar de novo' }));
    expect(retry).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByRole('button', { name: 'Voltar ao início' }));
    expect(mockReplace).toHaveBeenCalledWith('/home');
    expect(retry).toHaveBeenCalledTimes(2);
  });

  it('shows the not found screen with a way back home', async () => {
    await renderWithProviders(<NotFoundScreen />);

    expect(screen.getByText('Erro 404')).toBeTruthy();
    expect(screen.getByText('Tela não encontrada')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Ir para o início' }));
    expect(mockReplace).toHaveBeenCalledWith('/home');
  });
});
