import { Pressable, StyleSheet } from 'react-native';

import { Icon } from '@components/icons/Icon';
import type { IconName } from '@constants/icons';
import { RADIUS, SIZES } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

type IconButtonProps = {
  name: IconName;
  accessibilityLabel: string;
  onPress: () => void;
  disabled?: boolean;
};

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
