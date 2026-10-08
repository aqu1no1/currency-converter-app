import { AccessibilityInfo } from 'react-native';

import { act, screen } from '@testing-library/react-native';

import { Logo } from '@components/brand/Logo';
import { TIME_IN_MS } from '@constants/time.constants';
import { renderWithProviders } from '@test/utils/render-with-providers';

function mockReduceMotion(enabled: boolean) {
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(enabled);
}

async function renderLogo(ui: React.ReactElement) {
  await renderWithProviders(ui);
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

  it('shows the static logo with the $ when reduce motion is on', async () => {
    mockReduceMotion(true);
    await renderLogo(<Logo />);

    expect(screen.getByTestId('logo-static')).toBeTruthy();
    expect(screen.getByTestId('logo-currency-static')).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(10 * TIME_IN_MS.SECOND);
    });

    expect(screen.getByTestId('logo-currency-static')).toBeTruthy();
    expect(screen.queryByTestId('logo-currency-USD')).toBeNull();
  });

  it('cycles the currency in the diamond when motion is allowed', async () => {
    mockReduceMotion(false);
    await renderLogo(<Logo />);

    expect(screen.queryByTestId('logo-static')).toBeNull();
    expect(screen.getByTestId('logo-currency-USD')).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(2 * TIME_IN_MS.SECOND);
    });

    expect(screen.queryByTestId('logo-currency-USD')).toBeNull();
    expect(screen.getByTestId('logo-currency-BRL')).toBeTruthy();
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
    await renderLogo(<Logo variant="full" size={27} />);

    expect(screen.getByLabelText('Converter').props).toMatchObject({ width: 144, height: 27 });
  });
});
