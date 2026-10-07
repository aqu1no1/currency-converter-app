import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ICONS, type IconName } from '@constants/icons';

// Texto do design. Passa a vir do useTheme() quando o tema existir (API-30).
const DEFAULT_COLOR = '#14211B';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

/** Ícone decorativo: quem descreve a ação para o leitor de tela é o botão em volta. */
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
