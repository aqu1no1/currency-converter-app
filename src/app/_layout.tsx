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
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from '@components/layout/RootNavigator';
import { ApiProvider } from '@contexts/ApiProvider';
import { PreferencesProvider } from '@contexts/PreferencesContext';
import { i18nReady } from '@lib/i18n';
import { queryClient } from '@lib/query-client';
import { ThemeProvider } from '@theme/ThemeProvider';

void SplashScreen.preventAutoHideAsync();

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
        <QueryClientProvider client={queryClient}>
          <ApiProvider>
            <PreferencesProvider>
              <RootNavigator fontsReady={fontsReady} localeReady={localeReady}>
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />

                  <Stack.Screen name="onboarding" options={{ headerShown: false }} />

                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
              </RootNavigator>
            </PreferencesProvider>
          </ApiProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
