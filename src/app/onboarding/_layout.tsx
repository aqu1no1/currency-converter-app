import { Stack } from 'expo-router';

/**
 * Stack navigator shared by the three onboarding steps.
 *
 * @example
 * ```tsx
 * <OnboardingLayout />
 * ```
 */
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
