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
import { BRAND_COLORS } from '@constants/brand.constants';
import type { IconName } from '@constants/icons';

const VARIANTS = {
  filled: {
    backgroundColor: BRAND_COLORS.mint,
    borderColor: BRAND_COLORS.mint,
    textColor: BRAND_COLORS.green,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: BRAND_COLORS.outlineOnGreen,
    textColor: BRAND_COLORS.white,
  },
} as const;

/** Props do componente Button. */
type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  /** Função de callback acionada ao pressionar o botão. */
  onPress?: (event: GestureResponderEvent) => void;
  /** Variação visual: `filled` (fundo menta) para a ação principal, `outline` (só a borda) para a secundária. @default 'filled' */
  variant?: 'filled' | 'outline';
  /** Nome do ícone do projeto (`@constants/icons`) exibido ao lado do texto. @default undefined */
  icon?: IconName;
  /** Lado em que o ícone aparece em relação ao texto. @default 'left' */
  iconPosition?: 'left' | 'right';
  /** Se `true`, troca o conteúdo por um indicador de carregamento e bloqueia o toque. @default false */
  loading?: boolean;
  /** Se `true`, bloqueia o toque e deixa o botão translúcido. @default false */
  disabled?: boolean;
  /** Conteúdo do botão. Quando string, vira um `Text` com o estilo padrão. */
  children: ReactNode;
  /** Estilo extra aplicado ao container. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Botão do app com altura de 52, cantos de 16 e leve redução ao ser pressionado.
 * Tem as variantes `filled` e `outline`, ícone opcional à esquerda ou à direita
 * e os estados de carregamento e desabilitado.
 *
 * @example
 * ```tsx
 * <Button onPress={() => navigate('/onboarding')} icon="arrowRight" iconPosition="right">
 *   {t('welcome.start')}
 * </Button>
 *
 * <Button variant="outline" icon="converter" onPress={() => navigate('/converter')}>
 *   {t('welcome.convertNow')}
 * </Button>
 *
 * <Button loading>{t('common.save')}</Button>
 * ```
 */
export function Button({
  onPress,
  variant = 'filled',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  children,
  style,
  ...rest
}: ButtonProps) {
  const { backgroundColor, borderColor, textColor } = VARIANTS[variant];
  const blocked = disabled || loading;

  const iconElement = icon ? <Icon name={icon} size={20} color={textColor} /> : null;

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
    minHeight: 52,
    paddingHorizontal: 20,
    borderRadius: 16,
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
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
  },
});
