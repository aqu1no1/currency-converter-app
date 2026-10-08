import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AppTabBar } from '@components/layout/AppTabBar';

/**
 * Declares the five main app tabs and their localized labels.
 *
 * @example
 * ```tsx
 * <TabsLayout />
 * ```
 */
export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs tabBar={(props) => <AppTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: t('tabs.home') }} />
      <Tabs.Screen name="converter" options={{ title: t('tabs.converter') }} />
      <Tabs.Screen name="rates" options={{ title: t('tabs.rates') }} />
      <Tabs.Screen name="history" options={{ title: t('tabs.history') }} />
      <Tabs.Screen name="settings" options={{ title: t('tabs.settings') }} />
    </Tabs>
  );
}
