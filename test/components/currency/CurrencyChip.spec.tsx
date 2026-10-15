import { fireEvent, screen } from '@testing-library/react-native';

import { CurrencyChip } from '@components/currency/CurrencyChip';
import { renderWithProviders } from '@test/utils/render-with-providers';

describe('CurrencyChip', () => {
  it('shows the symbol and code and marks the selected state', async () => {
    await renderWithProviders(
      <CurrencyChip code="BRL" label="Real brasileiro" selected onSelect={jest.fn()} />,
    );

    expect(screen.getByText('R$')).toBeTruthy();
    expect(screen.getByText('BRL')).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Real brasileiro (BRL)' })).toBeSelected();
  });

  it('notifies the currency when pressed', async () => {
    const onSelect = jest.fn();
    await renderWithProviders(
      <CurrencyChip code="EUR" label="Euro" selected={false} onSelect={onSelect} />,
    );

    fireEvent.press(screen.getByRole('radio', { name: 'Euro (EUR)' }));

    expect(onSelect).toHaveBeenCalledWith('EUR');
  });
});
