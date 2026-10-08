import { fireEvent, screen } from '@testing-library/react-native';

import { ListRow } from '@components/list/ListRow';
import { renderWithProviders } from '@test/utils/render-with-providers';

describe('ListRow', () => {
  it('renders title, subtitle and trailing value', async () => {
    await renderWithProviders(<ListRow title="Dólar americano" subtitle="USD" value="R$ 5,20" />);

    expect(screen.getByText('Dólar americano')).toBeTruthy();
    expect(screen.getByText('USD')).toBeTruthy();
    expect(screen.getByText('R$ 5,20')).toBeTruthy();
  });

  it('supports an accessible press action', async () => {
    const onPress = jest.fn();
    await renderWithProviders(<ListRow title="Euro" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
