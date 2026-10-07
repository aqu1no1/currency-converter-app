import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ICONS, type IconName } from '@constants/icons';

const DEFAULT_COLOR = '#14211B';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 24, color = DEFAULT_COLOR }: IconProps) {
  return (
    <MaterialCommunityIcons
      name={ICONS[name]}
      size={size}
      color={color}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    />
  );
}
