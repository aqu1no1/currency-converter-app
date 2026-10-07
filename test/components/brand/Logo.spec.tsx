import { AccessibilityInfo } from 'react-native';

import { act, render, screen } from '@testing-library/react-native';

import { Logo } from '@components/brand/Logo';
import { TIME_IN_MS } from '@constants/time.constants';

function mockReduceMotion(enabled: boolean) {
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(enabled);
}

async function renderLogo(ui: React.ReactElement) {
  render(ui);
  // espera a leitura do "reduzir movimento"
  await act(async () => {});
}

describe('Logo', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('stays still on R$ when reduce motion is on', async () => {
    mockReduceMotion(true);
    await renderLogo(<Logo />);

    expect(screen.getByTestId('logo-currency-BRL')).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(10 * TIME_IN_MS.SECOND);
    });

    expect(screen.getByTestId('logo-currency-BRL')).toBeTruthy();
  });

  it('cycles the currency in the diamond when motion is allowed', async () => {
    mockReduceMotion(false);
    await renderLogo(<Logo />);

    expect(screen.getByTestId('logo-currency-BRL')).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(2 * TIME_IN_MS.SECOND);
    });

    expect(screen.queryByTestId('logo-currency-BRL')).toBeNull();
    expect(screen.getByTestId('logo-currency-EUR')).toBeTruthy();
  });

  it('shows the wordmark only in the full variant', async () => {
    mockReduceMotion(true);
    await renderLogo(<Logo variant="mark" />);
    expect(screen.queryByTestId('logo-wordmark')).toBeNull();

    await renderLogo(<Logo variant="full" />);
    expect(screen.getByTestId('logo-wordmark')).toBeTruthy();
  });

  it('keeps the variant proportions from the height', async () => {
    mockReduceMotion(true);
    await renderLogo(<Logo variant="full" size={21} />);

    expect(screen.getByLabelText('Converter').props).toMatchObject({ width: 144, height: 21 });
  });
});
