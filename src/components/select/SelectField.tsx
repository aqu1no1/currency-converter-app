import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon } from '@components/icons/Icon';
import { FONTS, RADIUS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

interface SelectFieldProps {
  /** Rótulo pequeno acima da caixa, como "De". */
  label: string;
  /** Texto da opção escolhida, exibido na caixa. */
  value: string;
  /** Rótulo lido pelo leitor de tela, com o nome do campo e o valor atual. */
  accessibilityLabel: string;
  /** Abre a lista de opções, normalmente um `SelectModal`. */
  onPress: () => void;
  /** Estilo extra do campo, como `flex: 1`. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Campo de escolha com rótulo, valor e seta para baixo, no lugar de um dropdown.
 *
 * Não guarda estado: só mostra o valor e avisa o toque, para a tela abrir um
 * `SelectModal` com as opções.
 *
 * @example
 * ```tsx
 * <SelectField
 *   label={t('history.from')}
 *   value={from}
 *   accessibilityLabel={t('history.fromLabel', { name: t(`currencies.${from}`), code: from })}
 *   onPress={() => setPicker('from')}
 * />
 * ```
 */
export function SelectField({
  label,
  value,
  accessibilityLabel,
  onPress,
  style,
}: SelectFieldProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [
          styles.field,
          { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
          pressed && styles.pressed,
        ]}
      >
        <Text numberOfLines={1} style={[styles.value, { color: colors.textHeading }]}>
          {value}
        </Text>
        <Icon name="chevronDown" size={18} color={colors.textHeading} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minWidth: 0, gap: 4 },
  label: {
    fontFamily: FONTS.bodyMedium,
    fontSize: TYPE.caption,
    lineHeight: TYPE.caption * 1.35,
  },
  field: {
    height: SIZES.button,
    paddingLeft: SIZES.cardPadding,
    paddingRight: 14,
    borderWidth: 1,
    borderRadius: RADIUS.field,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pressed: { transform: [{ scale: 0.97 }] },
  value: { flex: 1, fontFamily: FONTS.bodySemiBold, fontSize: TYPE.body },
});
