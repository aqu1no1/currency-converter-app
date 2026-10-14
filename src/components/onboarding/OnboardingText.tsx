import { StyleSheet, Text, View } from 'react-native';

import { FONTS, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

interface OnboardingTextProps {
  /** Linha de contexto em maiúsculas acima do título. */
  eyebrow: string;
  /** Título do passo. */
  title: string;
  /** Texto de apoio abaixo do título. */
  body: string;
}

/**
 * Bloco de texto dos passos do onboarding: contexto, título e descrição.
 *
 * @example
 * ```tsx
 * <OnboardingText
 *   eyebrow={t('onboarding.converterEyebrow')}
 *   title={t('onboarding.step1Title')}
 *   body={t('onboarding.step1Body')}
 * />
 * ```
 */
export function OnboardingText({ eyebrow, title, body }: OnboardingTextProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.eyebrow, { color: colors.highlight }]}>{eyebrow}</Text>
      <Text accessibilityRole="header" style={[styles.title, { color: colors.textHeading }]}>
        {title}
      </Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  eyebrow: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: TYPE.secondary,
    lineHeight: TYPE.secondary * 1.35,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: { fontFamily: FONTS.display, fontSize: TYPE.title, lineHeight: TYPE.title * 1.1 },
  body: { fontFamily: FONTS.body, fontSize: TYPE.body, lineHeight: TYPE.body * 1.5 },
});
