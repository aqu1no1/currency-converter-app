import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ICONS, type IconName } from '@constants/icons';
import { useTheme } from '@theme/ThemeProvider';

/** Props do componente Icon. */
type IconProps = {
  /** Nome do ícone no projeto, mapeado em `@constants/icons`. */
  name: IconName;
  /** Tamanho do ícone em pixels. @default 24 */
  size?: number;
  /** Cor do ícone. @default colors.textPrimary do tema ativo */
  color?: string;
};

/**
 * Ícone de interface do MaterialCommunityIcons. É decorativo: quem descreve a
 * ação para o leitor de tela é o botão em volta, com `accessibilityLabel`.
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
