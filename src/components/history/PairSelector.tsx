import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@components/icons/Icon';
import { SelectField } from '@components/select/SelectField';
import { RADIUS, SIZES } from '@constants/theme';
import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import { useTheme } from '@theme/ThemeProvider';

interface PairSelectorProps {
  /** Moeda de origem. */
  from: CurrencyCodeValue;
  /** Moeda de destino. */
  to: CurrencyCodeValue;
  /** Abre a escolha da moeda de origem. */
  onPressFrom: () => void;
  /** Abre a escolha da moeda de destino. */
  onPressTo: () => void;
  /** Inverte origem e destino. */
  onSwap: () => void;
}

/**
 * Seletor de par de moedas: campo "De", botão de inverter e campo "Para".
 *
 * Os campos só avisam o toque; a tela abre o `SelectModal` com as moedas. O botão
 * do meio é verde escuro, com o ícone de troca em verde-menta.
 *
 * @example
 * ```tsx
 * <PairSelector
 *   from="USD"
 *   to="BRL"
 *   onPressFrom={() => setPicker('from')}
 *   onPressTo={() => setPicker('to')}
 *   onSwap={swap}
 * />
 * ```
 */
export function PairSelector({ from, to, onPressFrom, onPressTo, onSwap }: PairSelectorProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <SelectField
        label={t('history.from')}
        value={from}
        accessibilityLabel={t('history.fromLabel', { name: t(`currencies.${from}`), code: from })}
        onPress={onPressFrom}
        style={styles.field}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('history.swap')}
        onPress={onSwap}
        style={({ pressed }) => [
          styles.swap,
          { backgroundColor: colors.primary },
          pressed && styles.pressed,
        ]}
      >
        <Icon name="converter" size={20} color={colors.accent} />
      </Pressable>
      <SelectField
        label={t('history.to')}
        value={to}
        accessibilityLabel={t('history.toLabel', { name: t(`currencies.${to}`), code: to })}
        onPress={onPressTo}
        style={styles.field}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  field: { flex: 1 },
  swap: {
    width: SIZES.button,
    height: SIZES.button,
    borderRadius: RADIUS.field,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { transform: [{ scale: 0.97 }] },
});
