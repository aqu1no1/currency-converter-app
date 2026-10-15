import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon } from '@components/icons/Icon';
import type { IconName } from '@constants/icons';
import { FONTS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

interface ListRowProps {
  /** Conteúdo à esquerda, como um `CurrencyBadge`. */
  leading?: ReactNode;
  /** Texto principal; fica em negrito quando há subtítulo. */
  title: string;
  /** Texto secundário abaixo do título. */
  subtitle?: string;
  /** Valor à direita, em destaque. */
  value?: string;
  /** Linha menor abaixo do valor, como a taxa inversa nas Cotações. */
  valueCaption?: string;
  /** Conteúdo à direita do valor, como uma seta. */
  trailing?: ReactNode;
  /** Ícone à esquerda do texto. */
  icon?: IconName;
  /** Torna a linha tocável. */
  onPress?: () => void;
  /** Rótulo lido pelo leitor de tela quando a linha é tocável. */
  accessibilityLabel?: string;
  /** Estilo extra da linha. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Linha de lista com altura mínima de 64, conteúdo à esquerda, textos e valor.
 *
 * Usada nas favoritas do Início, nas listas do Converter e das Cotações e no status da
 * sincronização.
 *
 * @example
 * ```tsx
 * <ListRow
 *   leading={<CurrencyBadge code="EUR" />}
 *   title="EUR"
 *   subtitle={t('currencies.EUR')}
 *   value="R$ 5,88"
 *   onPress={() => openHistory('EUR')}
 * />
 * ```
 */
export function ListRow({
  title,
  subtitle,
  value,
  valueCaption,
  icon,
  leading,
  trailing,
  onPress,
  accessibilityLabel,
  style,
}: ListRowProps) {
  const { colors } = useTheme();
  const content = (
    <>
      {leading}
      {icon ? <Icon name={icon} size={22} color={colors.textSecondary} /> : null}
      <View style={styles.copy}>
        <Text
          numberOfLines={1}
          style={[subtitle ? styles.title : styles.label, { color: colors.textPrimary }]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? (
        <View style={styles.values}>
          <Text style={[styles.value, { color: colors.textHeading }]}>{value}</Text>
          {valueCaption ? (
            <Text style={[styles.valueCaption, { color: colors.textSecondary }]}>
              {valueCaption}
            </Text>
          ) : null}
        </View>
      ) : null}
      {trailing}
    </>
  );

  const rowStyle = [styles.row, style];
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={rowStyle}
    >
      {content}
    </Pressable>
  ) : (
    <View style={rowStyle}>{content}</View>
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
  copy: { flex: 1, gap: 2 },
  title: { fontFamily: FONTS.bodySemiBold, fontSize: TYPE.body, lineHeight: TYPE.body * 1.35 },
  label: { fontFamily: FONTS.body, fontSize: TYPE.body, lineHeight: TYPE.body * 1.35 },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: TYPE.secondary,
    lineHeight: TYPE.secondary * 1.35,
  },
  values: { alignItems: 'flex-end', gap: 2 },
  value: {
    fontFamily: FONTS.display,
    fontSize: TYPE.value,
    lineHeight: TYPE.value * 1.2,
    fontVariant: ['tabular-nums'],
  },
  valueCaption: {
    fontFamily: FONTS.body,
    fontSize: TYPE.caption,
    lineHeight: TYPE.caption * 1.35,
    fontVariant: ['tabular-nums'],
  },
});
