import { fireEvent, screen } from '@testing-library/react-native';

import { SelectModal } from '@components/select/SelectModal';
import { renderWithProviders } from '@test/utils/render-with-providers';

const options = [
  { value: 'pt-BR', label: 'Português' },
  { value: 'en', label: 'English', description: 'Inglês' },
] as const;

describe('SelectModal', () => {
  it('lists the options and marks the current one', async () => {
    await renderWithProviders(
      <SelectModal
        visible
        title="Idioma"
        options={options}
        value="pt-BR"
        onSelect={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByText('Idioma')).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Português' })).toBeSelected();
    expect(screen.getByRole('radio', { name: 'Inglês (English)' })).not.toBeSelected();
  });

  it('selects an option and closes', async () => {
    const onSelect = jest.fn();
    const onClose = jest.fn();
    await renderWithProviders(
      <SelectModal
        visible
        title="Idioma"
        options={options}
        value="pt-BR"
        onSelect={onSelect}
        onClose={onClose}
      />,
    );

    fireEvent.press(screen.getByRole('radio', { name: 'Inglês (English)' }));

    expect(onSelect).toHaveBeenCalledWith('en');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes without selecting', async () => {
    const onSelect = jest.fn();
    const onClose = jest.fn();
    await renderWithProviders(
      <SelectModal
        visible
        title="Idioma"
        options={options}
        value="pt-BR"
        onSelect={onSelect}
        onClose={onClose}
      />,
    );

    fireEvent.press(screen.getAllByRole('button', { name: 'Fechar' })[0]!);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('renders nothing while hidden', async () => {
    await renderWithProviders(
      <SelectModal
        visible={false}
        title="Idioma"
        options={options}
        value="pt-BR"
        onSelect={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(screen.queryByText('Idioma')).toBeNull();
  });
});
