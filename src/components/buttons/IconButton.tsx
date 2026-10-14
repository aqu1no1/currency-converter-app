import { Pressable, StyleSheet } from 'react-native';

import { Icon } from '@components/icons/Icon';
import type { IconName } from '@constants/icons';
import { RADIUS, SIZES } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

interface IconButtonProps {
  /** Ícone exibido no centro. */
  name: IconName;
  /** Nome lido pelo leitor de tela, já que o botão não tem texto. */
  accessibilityLabel: string;
  /** Ação do toque. */
  onPress: () => void;
  /** Bloqueia o toque e deixa o botão translúcido. */
  disabled?: boolean;
}

/**
 * Botão circular de 44 com um ícone, usado em cabeçalhos.
 *
 * Tem fundo da superfície e borda clara, como o botão de Ajustes do Início.
 *
 * @example
 * ```tsx
 * <IconButton name="settings" accessibilityLabel={t('tabs.settings')} onPress={openSettings} />
 * ```
 */
export function IconButton({
  name,
  accessibilityLabel,
  onPress,
  disabled = false,
}: IconButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Icon name={name} size={20} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: SIZES.touchTarget,
    height: SIZES.touchTarget,
    borderWidth: 1,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { transform: [{ scale: 0.97 }] },
  disabled: { opacity: 0.5 },
});
