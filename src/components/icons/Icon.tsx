import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ICONS, type IconName } from '@constants/icons';

const DEFAULT_COLOR = '#14211B';

/** Props do componente Icon. */
type IconProps = {
  /** Nome do ícone no projeto, mapeado em `@constants/icons`. */
  name: IconName;
  /** Tamanho do ícone em pixels. @default 24 */
  size?: number;
  /** Cor do ícone. Vai passar a vir do `useTheme()` quando o tema existir. @default '#14211B' */
  color?: string;
};

/**
 * Ícone de interface do MaterialCommunityIcons. É decorativo: quem descreve a
 * ação para o leitor de tela é o botão em volta, com `accessibilityLabel`.
 */
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
