import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FONTS, RADIUS, SIZES, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

type OnboardingHeaderProps = {
  /** Etapa atual do onboarding. */
  step: 1 | 2 | 3;
  /** Conclui o onboarding ao tocar em Pular; omitido no último passo. */
  onSkip?: () => void;
};

/**
 * Shared three-step progress header; the final step intentionally has no Skip action.
 *
 * @example
 * ```tsx
 * <OnboardingHeader step={1} onSkip={finishOnboarding} />
 * ```
 */
export function OnboardingHeader({ step, onSkip }: OnboardingHeaderProps) {
  const { colors, dark } = useTheme();
  const { t } = useTranslation();
  const progressLabel = t('onboarding.progress', { step });
  const activeColor = dark ? colors.accent : colors.primary;

  return (
    <View style={styles.header}>
      <View accessibilityRole="image" accessibilityLabel={progressLabel} style={styles.progress}>
        <View
          style={[
            styles.marker,
            step === 1 && styles.activeMarker,
            { backgroundColor: step === 1 ? activeColor : colors.border },
          ]}
        />
        <View
          style={[
            styles.marker,
            step === 2 && styles.activeMarker,
            { backgroundColor: step === 2 ? activeColor : colors.border },
          ]}
        />
        <View
          style={[
            styles.marker,
            step === 3 && styles.activeMarker,
            { backgroundColor: step === 3 ? activeColor : colors.border },
          ]}
        />
      </View>
      {step < 3 && onSkip ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('onboarding.skip')}
          onPress={onSkip}
          style={styles.skipButton}
        >
          <Text style={[styles.skipLabel, { color: colors.highlight }]}>
            {t('onboarding.skip')}
          </Text>
        </Pressable>
      ) : (
        <View style={styles.skipButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 60,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progress: { minHeight: SIZES.touchTarget, flexDirection: 'row', alignItems: 'center', gap: 6 },
  marker: { width: 8, height: 8, borderRadius: RADIUS.pill },
  activeMarker: { width: 24 },
  skipButton: {
    minWidth: SIZES.touchTarget,
    minHeight: SIZES.touchTarget,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  skipLabel: { fontFamily: FONTS.bodySemiBold, fontSize: TYPE.secondary },
});
