import { StyleSheet, View } from 'react-native';

import { Button } from '@components/buttons/Button';
import { SIZES } from '@constants/theme';

interface OnboardingFooterProps {
  /** Texto do botão principal. */
  primaryLabel: string;
  /** Ação do botão principal. */
  onPrimary: () => void;
  /** Texto do botão "Voltar"; sem ele, o botão não aparece. */
  backLabel?: string;
  /** Ação do botão "Voltar". */
  onBack?: () => void;
}

/**
 * Rodapé dos passos do onboarding, com "Voltar" opcional e o botão principal com seta.
 *
 * @example
 * ```tsx
 * <OnboardingFooter
 *   backLabel={t('common.back')}
 *   onBack={goBack}
 *   primaryLabel={t('common.continue')}
 *   onPrimary={goNext}
 * />
 * ```
 */
export function OnboardingFooter({
  primaryLabel,
  onPrimary,
  backLabel,
  onBack,
}: OnboardingFooterProps) {
  return (
    <View style={styles.footer}>
      {onBack && backLabel ? (
        <Button variant="secondary" onPress={onBack}>
          {backLabel}
        </Button>
      ) : null}
      <Button
        icon="arrowRight"
        iconPosition="right"
        onPress={onPrimary}
        style={styles.primaryButton}
      >
        {primaryLabel}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    gap: SIZES.itemGap,
    paddingTop: SIZES.cardPadding,
    paddingBottom: SIZES.sectionGap,
  },
  primaryButton: { flex: 1 },
});
