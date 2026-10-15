import { type ErrorBoundaryProps, Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AppErrorBoundary } from '@components/feedback/AppErrorBoundary';
import { AppTabBar } from '@components/layout/AppTabBar';

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <AppErrorBoundary {...props} />;
}

export default function TabsLayout() {
  const { t } = useTranslation();

  const renderTabBar = (props: Parameters<typeof AppTabBar>[0]) => <AppTabBar {...props} />;

  return (
    <Tabs tabBar={renderTabBar}>
      <Tabs.Screen name="home" options={{ title: t('tabs.home'), headerShown: false }} />

      <Tabs.Screen name="converter" options={{ title: t('tabs.converter'), headerShown: false }} />

      <Tabs.Screen name="rates" options={{ title: t('tabs.rates'), headerShown: false }} />

      <Tabs.Screen name="history" options={{ title: t('tabs.history'), headerShown: false }} />

      <Tabs.Screen name="settings" options={{ title: t('tabs.settings'), headerShown: false }} />
    </Tabs>
  );
}
