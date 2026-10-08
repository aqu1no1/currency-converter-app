import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@components/buttons/Button';
import { Icon } from '@components/icons/Icon';
import { FONTS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

/** Propriedades do estado de erro. */
type ErrorStateProps = {
  /** Erro ou mensagem traduzida pela tela chamadora. */
  error: Error | string;
  /** Ação opcional para tentar novamente. */
  onRetry?: () => void;
};

/**
 * Apresenta a mensagem do erro e uma ação localizada de retry opcional.
 *
 * @example
 * ```tsx
 * <ErrorState error={error} onRetry={refetch} />
 * ```
 */
export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const message = typeof error === 'string' ? error : error.message;

  return (
    <View accessibilityRole="alert" style={styles.container}>
      <Icon name="error" size={28} color={colors.warningText} />
      <Text style={[styles.message, { color: colors.textPrimary }]}>{message}</Text>
      {onRetry ? (
        <Button variant="outline" onPress={onRetry}>
          {t('common.retry')}
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.itemGap,
    padding: SIZES.sectionGap,
  },
  message: { fontFamily: FONTS.body, fontSize: TYPE.body, textAlign: 'center' },
});
