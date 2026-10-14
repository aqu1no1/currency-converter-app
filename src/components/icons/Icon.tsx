import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ICONS, type IconName } from '@constants/icons';
import { useTheme } from '@theme/ThemeProvider';

type IconProps = {
  name: IconName;

  size?: number;

  color?: string;
};
/**
 * [EN] Renders a named app icon with configurable size and color.
 * [PT-BR] Renderiza um ícone do app com tamanho e cor configuráveis.
 *
 * @example
 * ```tsx
 * <Icon {...exampleProps} />
 * ```
 */

export function Icon({ name, size = 24, color }: IconProps) {
  const { colors } = useTheme();

  return (
    <MaterialCommunityIcons
      name={ICONS[name]}
      size={size}
      color={color ?? colors.textPrimary}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    />
  );
}
