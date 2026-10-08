import { Pressable, StyleSheet } from 'react-native';

import { Icon } from '@components/icons/Icon';
import type { IconName } from '@constants/icons';
import { RADIUS, SIZES } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

/** Propriedades do botão circular de ícone. */
type IconButtonProps = {
  /** Ícone escolhido no catálogo do projeto. */
  name: IconName;
  /** Rótulo obrigatório para leitores de tela. */
  accessibilityLabel: string;
  /** Ação executada ao tocar. */
  onPress: () => void;
  /** Se verdadeiro, desabilita e atenua o botão. @default false */
  disabled?: boolean;
};

/**
 * Botão de ícone com área tocável mínima de 44×44.
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
        { backgroundColor: colors.surfacePrimary, borderColor: colors.borderStrong },
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
