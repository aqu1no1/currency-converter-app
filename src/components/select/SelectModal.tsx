import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { IconButton } from '@components/buttons/IconButton';
import { Icon } from '@components/icons/Icon';
import { ListRow } from '@components/list/ListRow';
import { FONTS, RADIUS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

export type SelectOption<Value extends string = string> = {
  value: Value;

  label: string;

  description?: string;

  leading?: ReactNode;
};

interface SelectModalProps<Value extends string> {
  /** Se o modal está aberto. */
  visible: boolean;
  /** Título no topo do painel. */
  title: string;
  /** Opções da lista, cada uma com valor, rótulo e, opcionalmente, descrição e ícone. */
  options: readonly SelectOption<Value>[];
  /** Valor da opção marcada. */
  value: Value;
  /** Chamado com o valor da opção tocada; o modal fecha logo depois. */
  onSelect: (value: Value) => void;
  /** Fecha o modal (fundo, botão fechar ou voltar do Android). */
  onClose: () => void;
}

/**
 * Modal de escolha única centralizado na tela, no lugar de um dropdown.
 *
 * Mostra as opções numa lista com rolagem, com um ✓ na marcada. Tocar numa opção
 * escolhe e fecha; tocar no fundo, no botão fechar ou no voltar do Android só fecha.
 * Use junto com o `SelectField` ou com qualquer outro gatilho.
 *
 * @example
 * ```tsx
 * <SelectModal
 *   visible={open}
 *   title={t('history.pickFrom')}
 *   options={currencyOptions}
 *   value={from}
 *   onSelect={setFrom}
 *   onClose={() => setOpen(false)}
 * />
 * ```
 */
export function SelectModal<Value extends string>({
  visible,
  title,
  options,
  value,
  onSelect,
  onClose,
}: SelectModalProps<Value>) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          onPress={onClose}
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.shadow }]}
        />
        <View style={[styles.card, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text accessibilityRole="header" style={[styles.title, { color: colors.textHeading }]}>
              {title}
            </Text>
            <IconButton name="close" accessibilityLabel={t('common.close')} onPress={onClose} />
          </View>
          <ScrollView
            accessibilityRole="radiogroup"
            accessibilityLabel={title}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.box,
                { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
              ]}
            >
              {options.map((option, index) => {
                const selected = option.value === value;
                const name = option.description
                  ? `${option.description} (${option.label})`
                  : option.label;

                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="radio"
                    accessibilityLabel={name}
                    accessibilityState={{ checked: selected, selected }}
                    onPress={() => {
                      onSelect(option.value);
                      onClose();
                    }}
                    style={({ pressed }) => [
                      index > 0 && { borderTopWidth: 1, borderTopColor: colors.divider },
                      selected && { backgroundColor: colors.surfaceAlternate },
                      pressed && { backgroundColor: colors.surfaceAlternate },
                    ]}
                  >
                    <ListRow
                      leading={option.leading}
                      title={option.label}
                      subtitle={option.description}
                      trailing={
                        selected ? <Icon name="check" size={22} color={colors.highlight} /> : null
                      }
                    />
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: SIZES.screenPadding },
  card: {
    maxHeight: '80%',
    paddingHorizontal: SIZES.screenPadding,
    paddingBottom: SIZES.cardPadding,
    borderRadius: RADIUS.card,
  },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.itemGap,
  },
  title: {
    flex: 1,
    fontFamily: FONTS.bodySemiBold,
    fontSize: TYPE.section,
    lineHeight: TYPE.section * 1.3,
  },
  box: { overflow: 'hidden', borderWidth: 1, borderRadius: RADIUS.list },
});
