import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  type GestureResponderEvent,
  Pressable,
  type PressableProps,
  type StyleProp,
  StyleSheet,
  Text,
  type ViewStyle,
} from 'react-native';

import { Icon } from '@components/icons/Icon';
import type { IconName } from '@constants/icons';
import { type Colors, FONTS, RADIUS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

function getVariantColors(
  variant: 'filled' | 'outline' | 'secondary',
  tone: 'default' | 'brand',
  colors: Colors,
  dark: boolean,
) {
  if (variant === 'secondary') {
    return {
      backgroundColor: colors.surfacePrimary,
      borderColor: colors.border,
      textColor: colors.textHeading,
    };
  }

  if (variant === 'outline') {
    return {
      backgroundColor: 'transparent',
      borderColor: tone === 'brand' ? colors.borderOnBrand : colors.borderStrong,
      textColor: tone === 'brand' ? colors.textOnBrand : colors.textPrimary,
    };
  }

  if (tone === 'brand') {
    return {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
      textColor: colors.textOnAccent,
    };
  }

  return {
    backgroundColor: dark ? colors.accent : colors.primary,
    borderColor: dark ? colors.accent : colors.primary,
    textColor: dark ? colors.textOnAccent : colors.white,
  };
}

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  onPress?: (event: GestureResponderEvent) => void;

  variant?: 'filled' | 'outline' | 'secondary';

  tone?: 'default' | 'brand';

  icon?: IconName;

  iconPosition?: 'left' | 'right';

  loading?: boolean;

  disabled?: boolean;

  children: ReactNode;

  style?: StyleProp<ViewStyle>;
};
/**
 * [EN] Renders a themed action button with optional icon and loading state.
 * [PT-BR] Renderiza um botão temático com ícone opcional e estado de carregamento.
 *
 * @example
 * ```tsx
 * <Button onPress={() => navigate('/onboarding')} icon="arrowRight" iconPosition="right">
 * {t('welcome.start')}
 * </Button>
 * <Button variant="outline" icon="converter" onPress={() => navigate('/converter')}>
 * {t('welcome.convertNow')}
 * </Button>
 * <Button loading>{t('common.save')}</Button>
 * ```
 */

export function Button({
  onPress,
  variant = 'filled',
  tone = 'default',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  children,
  style,
  ...rest
}: ButtonProps) {
  const { colors, dark } = useTheme();
  const { backgroundColor, borderColor, textColor } = getVariantColors(variant, tone, colors, dark);
  const blocked = disabled || loading;

  const iconElement = icon ? <Icon name={icon} size={18} color={textColor} /> : null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: blocked, busy: loading }}
      disabled={blocked}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor, borderColor },
        pressed && styles.pressed,
        disabled && !loading && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} testID="button-loading" />
      ) : (
        <>
          {iconPosition === 'left' && iconElement}
          {typeof children === 'string' ? (
            <Text style={[styles.label, { color: textColor }]}>{children}</Text>
          ) : (
            children
          )}
          {iconPosition === 'right' && iconElement}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: SIZES.button,
    paddingHorizontal: SIZES.screenPadding,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: TYPE.body,
    lineHeight: 24,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
