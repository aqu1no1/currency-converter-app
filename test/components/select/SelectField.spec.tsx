import { fireEvent, screen } from '@testing-library/react-native';

import { SelectField } from '@components/select/SelectField';
import { renderWithProviders } from '@test/utils/render-with-providers';

describe('SelectField', () => {
  it('shows the label and value and notifies the press', async () => {
    const onPress = jest.fn();
    await renderWithProviders(
      <SelectField label="De" value="USD" accessibilityLabel="Moeda de origem" onPress={onPress} />,
    );

    expect(screen.getByText('De')).toBeTruthy();
    expect(screen.getByText('USD')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Moeda de origem' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
