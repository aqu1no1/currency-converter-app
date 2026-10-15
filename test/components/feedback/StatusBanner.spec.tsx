import { fireEvent, screen } from '@testing-library/react-native';

import { StatusBanner } from '@components/feedback/StatusBanner';
import { renderWithProviders } from '@test/utils/render-with-providers';

describe('StatusBanner', () => {
  it('shows the message and runs the short action', async () => {
    const onPress = jest.fn();
    await renderWithProviders(
      <StatusBanner message="Sem conexão." action={{ label: 'Tentar', onPress }} />,
    );

    expect(screen.getByText('Sem conexão.')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Tentar' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('can show only the message', async () => {
    await renderWithProviders(<StatusBanner message="Aviso" />);

    expect(screen.getByText('Aviso')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
