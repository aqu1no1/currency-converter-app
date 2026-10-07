import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet } from 'react-native';
import type { ReactTestRendererJSON } from 'react-test-renderer';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from '@components/ui/Button';
import { BRAND_COLORS } from '@constants/brand.constants';

function buttonStyle() {
  return StyleSheet.flatten(screen.getByRole('button').props.style);
}

function textColor(label: string) {
  return StyleSheet.flatten(screen.getByText(label).props.style).color;
}

describe('Button', () => {
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress}>Começar</Button>);

    fireEvent.press(screen.getByRole('button', { name: 'Começar' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('uses the mint background and green text in the filled variant', () => {
    render(<Button>Começar</Button>);

    expect(buttonStyle().backgroundColor).toBe(BRAND_COLORS.mint);
    expect(textColor('Começar')).toBe(BRAND_COLORS.green);
  });

  it('uses only the border and white text in the outline variant', () => {
    render(<Button variant="outline">Converter agora</Button>);

    expect(buttonStyle()).toMatchObject({
      backgroundColor: 'transparent',
      borderColor: BRAND_COLORS.outlineOnGreen,
    });
    expect(textColor('Converter agora')).toBe(BRAND_COLORS.white);
  });

  it.each([
    ['left', 1],
    ['right', 0],
  ] as const)('places the icon on the %s', (iconPosition, labelIndex) => {
    render(
      <Button icon="arrowRight" iconPosition={iconPosition}>
        Começar
      </Button>,
    );

    const tree = screen.toJSON() as ReactTestRendererJSON;
    const rendered = (tree.children ?? []).map((child) =>
      typeof child === 'string' ? child : child.children?.[0],
    );

    expect(screen.UNSAFE_getByType(MaterialCommunityIcons).props).toMatchObject({
      name: 'arrow-right',
      color: BRAND_COLORS.green,
    });
    expect(rendered).toHaveLength(2);
    expect(rendered.indexOf('Começar')).toBe(labelIndex);
  });

  it('shows a loading indicator and ignores presses while loading', () => {
    const onPress = jest.fn();
    render(
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

  it('ignores presses and looks faded when disabled', () => {
    const onPress = jest.fn();
    render(
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
