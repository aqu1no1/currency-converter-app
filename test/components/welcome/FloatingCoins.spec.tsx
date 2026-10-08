import { AccessibilityInfo, StyleSheet } from 'react-native';
import { getAnimatedStyle } from 'react-native-reanimated';

import { act, screen } from '@testing-library/react-native';

import { FloatingCoins } from '@components/welcome/FloatingCoins';
import { lightColors } from '@constants/theme';
import { TIME_IN_MS } from '@constants/time.constants';
import { renderWithProviders } from '@test/utils/render-with-providers';

const SYMBOLS = ['$', '€', '£', '¥', 'R$', '元'];

function mockReduceMotion(enabled: boolean) {
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(enabled);
}

async function renderCoins() {
  await renderWithProviders(<FloatingCoins />);
  await act(async () => {});
}

function translateY(symbol: string) {
  const style = getAnimatedStyle(
    screen.getByTestId(`floating-coin-${symbol}`, { includeHiddenElements: true }),
  ) as {
    transform: { translateY: number }[];
  };
  return style.transform[0]!.translateY;
}

async function advance(ms: number) {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
}

describe('FloatingCoins', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('shows the six coins with the theme colors', async () => {
    mockReduceMotion(true);
    await renderCoins();

    for (const symbol of SYMBOLS) {
      const coin = screen.getByTestId(`floating-coin-${symbol}`, { includeHiddenElements: true });
      expect(StyleSheet.flatten(coin.props.style).borderColor).toBe(lightColors.coinBorderOnBrand);
      expect(screen.getByText(symbol, { includeHiddenElements: true })).toBeTruthy();
    }
  });

  it('is decorative: no touches and hidden from screen readers', async () => {
    mockReduceMotion(true);
    await renderCoins();

    const layer = screen.getByTestId('floating-coins', { includeHiddenElements: true });

    expect(layer.props).toMatchObject({
      pointerEvents: 'none',
      importantForAccessibility: 'no-hide-descendants',
    });
    expect(screen.queryByText('$')).toBeNull();
  });

  it('keeps the coins still with reduce motion on', async () => {
    mockReduceMotion(true);
    await renderCoins();

    const before = translateY('€');
    await advance(3 * TIME_IN_MS.SECOND);

    expect(translateY('€')).toBe(before);
  });

  it('floats the coins up and down when motion is allowed', async () => {
    mockReduceMotion(false);
    await renderCoins();

    const before = translateY('€');
    await advance(3 * TIME_IN_MS.SECOND);
    const after = translateY('€');

    expect(after).not.toBe(before);
    expect(after).toBeLessThanOrEqual(0);
    expect(after).toBeGreaterThanOrEqual(-16);
  });
});
