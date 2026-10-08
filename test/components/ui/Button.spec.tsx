import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet } from 'react-native';
import type { ReactTestRendererJSON } from 'react-test-renderer';

import { fireEvent, screen } from '@testing-library/react-native';

import { Button } from '@components/ui/Button';
import { lightColors } from '@constants/theme';
import { renderWithProviders } from '@test/utils/render-with-providers';

function buttonStyle() {
  return StyleSheet.flatten(screen.getByRole('button').props.style);
}

function textColor(label: string) {
  return StyleSheet.flatten(screen.getByText(label).props.style).color;
}

describe('Button', () => {
  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    await renderWithProviders(<Button onPress={onPress}>Começar</Button>);

    fireEvent.press(screen.getByRole('button', { name: 'Começar' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('uses the theme primary color and white text in the filled variant', async () => {
    await renderWithProviders(<Button>Começar</Button>);

    expect(buttonStyle().backgroundColor).toBe(lightColors.primary);
    expect(textColor('Começar')).toBe(lightColors.white);
  });

  it('uses only the theme border and primary text in the outline variant', async () => {
    await renderWithProviders(<Button variant="outline">Converter agora</Button>);

    expect(buttonStyle()).toMatchObject({
      backgroundColor: 'transparent',
      borderColor: lightColors.borderStrong,
    });
    expect(textColor('Converter agora')).toBe(lightColors.textPrimary);
  });

  it('uses accent colors over a brand background', async () => {
    await renderWithProviders(<Button tone="brand">Começar</Button>);

    expect(buttonStyle().backgroundColor).toBe(lightColors.accent);
    expect(textColor('Começar')).toBe(lightColors.textOnAccent);
  });

  it.each([
    ['left', 1],
    ['right', 0],
  ] as const)('places the icon on the %s', async (iconPosition, labelIndex) => {
    await renderWithProviders(
      <Button tone="brand" icon="arrowRight" iconPosition={iconPosition}>
        Começar
      </Button>,
    );

    const tree = screen.toJSON() as ReactTestRendererJSON;
    const rendered = (tree.children ?? []).map((child) =>
      typeof child === 'string' ? child : child.children?.[0],
    );

    expect(screen.UNSAFE_getByType(MaterialCommunityIcons).props).toMatchObject({
      name: 'arrow-right',
      color: lightColors.textOnAccent,
    });
    expect(rendered).toHaveLength(2);
    expect(rendered.indexOf('Começar')).toBe(labelIndex);
  });

  it('shows a loading indicator and ignores presses while loading', async () => {
    const onPress = jest.fn();
    await renderWithProviders(
      <Button loading onPress={onPress}>
        Começar
      </Button>,
    );

    fireEvent.press(screen.getByRole('button'));

    expect(screen.getByTestId('button-loading')).toBeTruthy();
    expect(screen.queryByText('Começar')).toBeNull();
    expect(screen.getByRole('button')).toBeBusy();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('ignores presses and looks faded when disabled', async () => {
    const onPress = jest.fn();
    await renderWithProviders(
      <Button disabled onPress={onPress}>
        Começar
      </Button>,
    );

    fireEvent.press(screen.getByRole('button'));

    expect(screen.getByRole('button')).toBeDisabled();
    expect(buttonStyle().opacity).toBe(0.5);
    expect(onPress).not.toHaveBeenCalled();
  });
});
