import { fireEvent, screen } from '@testing-library/react-native';

import { Keypad } from '@components/converter/Keypad';
import { renderWithProviders } from '@test/utils/render-with-providers';

describe('Keypad', () => {
  it('sends digit and shortcut keys', async () => {
    const onPress = jest.fn();
    await renderWithProviders(<Keypad onPress={onPress} />);

    fireEvent.press(screen.getByRole('button', { name: '7' }));
    fireEvent.press(screen.getByRole('button', { name: 'Vírgula' }));
    fireEvent.press(screen.getByRole('button', { name: 'Somar mil' }));
    fireEvent.press(screen.getByRole('button', { name: 'Apagar' }));
    fireEvent.press(screen.getByRole('button', { name: 'Limpar' }));

    expect(onPress.mock.calls.map(([key]) => key)).toEqual([
      '7',
      'decimal',
      'add1000',
      'delete',
      'clear',
    ]);
  });

  it('shows the locale decimal separator and shortcut texts', async () => {
    await renderWithProviders(<Keypad onPress={jest.fn()} />);

    expect(screen.getByText(',')).toBeTruthy();
    expect(screen.getByText('+100')).toBeTruthy();
    expect(screen.getByText('+1 mil')).toBeTruthy();
  });
});
