import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ICONS, type IconName } from '@constants/icons';
import { useTheme } from '@theme/ThemeProvider';

interface IconProps {
  /** Nome do ícone no projeto (mapeado para o MaterialCommunityIcons em `ICONS`). */
  name: IconName;
  /** Tamanho em pontos. */
  size?: number;
  /** Cor do ícone; por padrão, a cor do texto do tema. */
  color?: string;
}

/**
 * Ícone do app pelo nome do projeto, sem depender do nome do MaterialCommunityIcons.
 *
 * É decorativo para o leitor de tela; o rótulo fica no elemento que o contém.
 *
 * @example
 * ```tsx
 * <Icon name="history" size={18} color={colors.textOnAccent} />
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
