import { StyleSheet, View } from 'react-native';

import { Button } from '@components/buttons/Button';
import { SIZES } from '@constants/theme';

type OnboardingFooterProps = {
  /** Rótulo traduzido da ação principal. */
  primaryLabel: string;
  /** Avança ou conclui o onboarding. */
  onPrimary: () => void;
  /** Rótulo traduzido da ação secundária. */
  backLabel?: string;
  /** Volta para a etapa anterior; omitido na primeira etapa. */
  onBack?: () => void;
};

/**
 * Bottom actions shared by onboarding steps.
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
    <View style={[styles.footer, { paddingBottom: SIZES.sectionGap }]}>
      {onBack && backLabel ? (
        <Button variant="outline" onPress={onBack} style={styles.backButton}>
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
  footer: { flexDirection: 'row', gap: SIZES.itemGap, paddingTop: SIZES.itemGap },
  backButton: { minWidth: 112 },
  primaryButton: { flex: 1 },
});
