import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@components/icons/Icon';
import { FONTS, RADIUS, SIZES } from '@constants/theme';
import type { KeypadKey } from '@utils/converter.util';
import { getDecimalSeparator } from '@utils/format.util';
import { useTheme } from '@theme/ThemeProvider';

const ROWS: readonly (readonly KeypadKey[])[] = [
  ['7', '8', '9', 'delete'],
  ['4', '5', '6', 'clear'],
  ['1', '2', '3', 'add100'],
  ['decimal', '0', '00', 'add1000'],
];
const ACTION_KEYS: readonly KeypadKey[] = ['delete', 'clear', 'add100', 'add1000'];
const KEY_GAP = 8;
const LARGE_TEXT = 20;
const SMALL_TEXT = 15;

type KeypadProps = {
  onPress: (key: KeypadKey) => void;
};
/**
 * [EN] Renders the converter number pad with shortcuts to clear and add amounts.
 * [PT-BR] Renderiza o teclado numérico do conversor com atalhos para limpar e somar valores.
 *
 * @example
 * ```tsx
 * <Keypad onPress={pressKey} />
 * ```
 */

export function Keypad({ onPress }: KeypadProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const decimalSeparator = getDecimalSeparator();

  const labels: Partial<Record<KeypadKey, { text: string; accessibilityLabel: string }>> = {
    decimal: { text: decimalSeparator, accessibilityLabel: t('converter.keys.decimal') },
    clear: { text: 'C', accessibilityLabel: t('converter.keys.clear') },
    add100: { text: '+100', accessibilityLabel: t('converter.keys.add100') },
    add1000: {
      text: t('converter.keys.add1000Text'),
      accessibilityLabel: t('converter.keys.add1000'),
    },
  };

  function press(key: KeypadKey) {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    onPress(key);
  }

  return (
    <View style={styles.keypad}>
      {ROWS.map((row) => (
        <View key={row.join()} style={styles.row}>
          {row.map((key) => {
            const label = labels[key];
            const text = label?.text ?? key;
            const isAction = ACTION_KEYS.includes(key);

            return (
              <Pressable
                key={key}
                accessibilityRole="button"
                accessibilityLabel={
                  key === 'delete' ? t('converter.keys.delete') : (label?.accessibilityLabel ?? key)
                }
                onPress={() => press(key)}
                style={({ pressed }) => [
                  styles.key,
                  {
                    backgroundColor:
                      isAction || pressed ? colors.accentSoft : colors.surfacePrimary,
                  },
                  pressed && styles.pressed,
                ]}
              >
                {key === 'delete' ? (
                  <Icon name="backspace" size={22} color={colors.textHeading} />
                ) : (
                  <Text
                    style={[
                      styles.label,
                      {
                        color: colors.textHeading,
                        fontSize: text.length > 2 ? SMALL_TEXT : LARGE_TEXT,
                      },
                    ]}
                  >
                    {text}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keypad: { gap: KEY_GAP, paddingVertical: SIZES.itemGap },
  row: { flexDirection: 'row', gap: KEY_GAP },
  key: {
    flex: 1,
    height: SIZES.key,
    borderRadius: RADIUS.key,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { transform: [{ scale: 0.97 }] },
  label: { fontFamily: FONTS.displayMedium },
});
