import { StyleSheet, View } from 'react-native';

import { Button } from '@components/buttons/Button';
import { SIZES } from '@constants/theme';

type OnboardingFooterProps = {
  primaryLabel: string;

  onPrimary: () => void;

  backLabel?: string;

  onBack?: () => void;
};
/**
 * [EN] Renders the shared back and primary actions for onboarding steps.
 * [PT-BR] Renderiza as ações compartilhadas de voltar e avançar do onboarding.
 *
 * @example
 * ```tsx
 * <OnboardingFooter primaryLabel={t('common.continue')} onPrimary={goNext} />
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
