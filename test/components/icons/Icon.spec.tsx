import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { render, screen } from '@testing-library/react-native';

import { Icon } from '@components/icons/Icon';
import { ICONS, type IconName } from '@constants/icons';

function renderedIcon() {
  return screen.UNSAFE_getByType(MaterialCommunityIcons).props;
}

describe('Icon', () => {
  it('uses the design text color and size 24 by default', () => {
    render(<Icon name="history" />);

    expect(renderedIcon()).toMatchObject({ name: 'chart-line', color: '#14211B', size: 24 });
  });

  it('uses the color and size passed by prop', () => {
    render(<Icon name="close" color="#9FE1CB" size={18} />);

    expect(renderedIcon()).toMatchObject({ name: 'close', color: '#9FE1CB', size: 18 });
  });

  it('is decorative for screen readers', () => {
    render(<Icon name="check" />);

    expect(renderedIcon()).toMatchObject({ accessible: false });
  });

  it.each(Object.keys(ICONS) as IconName[])('renders %s', (name) => {
    render(<Icon name={name} />);

    expect(renderedIcon().name).toBe(ICONS[name]);
    expect(MaterialCommunityIcons.glyphMap).toHaveProperty(ICONS[name]);
  });
});
