import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { screen } from '@testing-library/react-native';

import { Icon } from '@components/icons/Icon';
import { ICONS, type IconName } from '@constants/icons';
import { lightColors } from '@constants/theme';
import { renderWithProviders } from '@test/utils/render-with-providers';

function renderedIcon() {
  return screen.UNSAFE_getByType(MaterialCommunityIcons).props;
}

describe('Icon', () => {
  it('uses the theme text color and size 24 by default', async () => {
    await renderWithProviders(<Icon name="history" />);

    expect(renderedIcon()).toMatchObject({
      name: 'chart-line',
      color: lightColors.textPrimary,
      size: 24,
    });
  });

  it('uses the color and size passed by prop', async () => {
    await renderWithProviders(<Icon name="close" color="#9FE1CB" size={18} />);

    expect(renderedIcon()).toMatchObject({ name: 'close', color: '#9FE1CB', size: 18 });
  });

  it('is decorative for screen readers', async () => {
    await renderWithProviders(<Icon name="check" />);

    expect(renderedIcon()).toMatchObject({ accessible: false });
  });

  it.each(Object.keys(ICONS) as IconName[])('renders %s', async (name) => {
    await renderWithProviders(<Icon name={name} />);

    expect(renderedIcon().name).toBe(ICONS[name]);
    expect(MaterialCommunityIcons.glyphMap).toHaveProperty(ICONS[name]);
  });
});
