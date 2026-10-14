import { Stack } from 'expo-router';
/**
 * [EN] Defines the onboarding navigation stack.
 * [PT-BR] Define a navegação entre as etapas do onboarding.
 *
 * @example
 * ```tsx
 * <OnboardingLayout />
 * ```
 */

const OnboardingLayout = () => {
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default OnboardingLayout;
