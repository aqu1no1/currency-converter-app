import { Pressable, StyleSheet, Text } from 'react-native';

import { Icon } from '@components/icons/Icon';
import { FONTS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

interface SettingsRowProps {
  /** Nome da preferência, como "Idioma". */
  label: string;
  /** Valor atual, exibido à direita, como "Português". */
  value: string;
  /** Rótulo lido pelo leitor de tela, com o nome e o valor atual. */
  accessibilityLabel?: string;
  /** Abre a escolha da preferência; sem ela, a linha só mostra o valor. */
  onPress?: () => void;
}

/**
 * Linha de 64 dos Ajustes com o nome da preferência, o valor atual e uma seta.
 *
 * Fica dentro de um `ListBox`, que coloca as divisórias entre as linhas.
 *
 * @example
 * ```tsx
 * <ListBox>
 *   <SettingsRow label={t('settings.language')} value="Português" onPress={openLanguage} />
 * </ListBox>
 * ```
 */
export function SettingsRow({ label, value, accessibilityLabel, onPress }: SettingsRowProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surfaceAlternate }]}
    >
      <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
      <Text numberOfLines={1} style={[styles.value, { color: colors.textSecondary }]}>
        {value}
      </Text>
      {onPress ? <Icon name="chevronRight" size={18} color={colors.textWeak} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: SIZES.listRow,
    paddingVertical: SIZES.itemGap,
    paddingHorizontal: SIZES.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.itemGap,
  },
  label: { flex: 1, fontFamily: FONTS.body, fontSize: TYPE.body, lineHeight: TYPE.body * 1.35 },
  value: {
    flexShrink: 1,
    fontFamily: FONTS.body,
    fontSize: TYPE.body,
    lineHeight: TYPE.body * 1.35,
  },
});
