import {
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
} from '@expo-google-fonts/instrument-sans';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useFonts } from 'expo-font';
import { type ErrorBoundaryProps, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppErrorBoundary } from '@components/feedback/AppErrorBoundary';
import { RootNavigator } from '@components/layout/RootNavigator';
import { ApiProvider } from '@contexts/ApiProvider';
import { PreferencesProvider } from '@contexts/PreferencesContext';
import { i18nReady } from '@lib/i18n';
import { setupOnlineManager } from '@lib/online-manager';
import { QUERY_CACHE_MAX_AGE, queryClient, queryPersister } from '@lib/query-client';
import { ThemeProvider } from '@theme/ThemeProvider';

void SplashScreen.preventAutoHideAsync();
setupOnlineManager();

const PERSIST_OPTIONS = { persister: queryPersister, maxAge: QUERY_CACHE_MAX_AGE };

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppErrorBoundary {...props} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    ...MaterialCommunityIcons.font,
    ...MaterialIcons.font,
  });

  const [localeReady, setLocaleReady] = useState(false);

  const fontsReady = fontsLoaded || fontError !== null;

  useEffect(() => {
    let mounted = true;

    void i18nReady.then(
      () => mounted && setLocaleReady(true),
      () => mounted && setLocaleReady(true),
    );

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PersistQueryClientProvider client={queryClient} persistOptions={PERSIST_OPTIONS}>
          <ApiProvider>
            <PreferencesProvider>
              <RootNavigator fontsReady={fontsReady} localeReady={localeReady}>
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />

                  <Stack.Screen name="onboarding" options={{ headerShown: false }} />

                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                  <Stack.Screen name="+not-found" options={{ headerShown: false }} />
                </Stack>
              </RootNavigator>
            </PreferencesProvider>
          </ApiProvider>
        </PersistQueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
