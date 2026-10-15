import { fireEvent, screen } from '@testing-library/react-native';

import { Segmented } from '@components/buttons/Segmented';
import { renderWithProviders } from '@test/utils/render-with-providers';

const options = [
  { label: '1M', value: 'month' },
  { label: '1A', value: 'year' },
  { label: 'Tudo', value: 'all' },
] as const;

describe('Segmented', () => {
  it('marks the selected value', async () => {
    await renderWithProviders(
      <Segmented
        options={options}
        value="year"
        onChange={jest.fn()}
        accessibilityLabel="Período"
      />,
    );

    expect(screen.getByRole('radio', { name: '1A' })).toBeSelected();
  });

  it('notifies when another value is selected', async () => {
    const onChange = jest.fn();
    await renderWithProviders(
      <Segmented options={options} value="year" onChange={onChange} accessibilityLabel="Período" />,
    );

    fireEvent.press(screen.getByRole('radio', { name: 'Tudo' }));

    expect(onChange).toHaveBeenCalledWith('all');
  });

  it('keeps the selection with the onBrand tone', async () => {
    await renderWithProviders(
      <Segmented
        tone="onBrand"
        options={options}
        value="all"
        onChange={jest.fn()}
        accessibilityLabel="Período"
      />,
    );

    expect(screen.getByRole('radio', { name: 'Tudo' })).toBeSelected();
  });

  it('shows icons and marks the option as checked with the solid tone', async () => {
    await renderWithProviders(
      <Segmented
        tone="solid"
        options={[
          { label: 'Claro', value: 'light', icon: 'themeLight' },
          { label: 'Escuro', value: 'dark', icon: 'themeDark' },
        ]}
        value="dark"
        onChange={jest.fn()}
        accessibilityLabel="Tema"
      />,
    );

    expect(screen.getByRole('radio', { name: 'Escuro' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Claro' })).not.toBeChecked();
  });
});
