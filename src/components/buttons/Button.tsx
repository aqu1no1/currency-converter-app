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

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  /** Ação do toque. */
  onPress?: (event: GestureResponderEvent) => void;
  /** `filled` (padrão) é o botão principal; `outline` só tem borda; `secondary` tem fundo branco e borda clara. */
  variant?: 'filled' | 'outline' | 'secondary';
  /** `brand` adapta as cores para fundo verde escuro (cards e telas de marca). */
  tone?: 'default' | 'brand';
  /** Ícone exibido junto do texto. */
  icon?: IconName;
  /** Lado do ícone em relação ao texto. */
  iconPosition?: 'left' | 'right';
  /** Troca o conteúdo por um indicador de carregamento e bloqueia o toque. */
  loading?: boolean;
  /** Bloqueia o toque e deixa o botão translúcido. */
  disabled?: boolean;
  /** Texto do botão (ou conteúdo personalizado). */
  children: ReactNode;
  /** Estilo extra do contêiner, por exemplo `flex: 1` para dividir a largura. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Botão de ação do app, com altura de 52 e cantos de 16.
 *
 * Cobre os botões principais, os de borda (como "Converter agora" nas Boas-vindas)
 * e o secundário branco (como "Voltar" no onboarding). Aceita ícone à esquerda ou
 * à direita e um estado de carregamento.
 *
 * @example
 * ```tsx
 * <Button icon="arrowRight" iconPosition="right" onPress={goNext}>
 *   {t('common.continue')}
 * </Button>
 * <Button variant="secondary" onPress={goBack}>
 *   {t('common.back')}
 * </Button>
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
