import type { ConfigContext, ExpoConfig } from 'expo/config';

import { version } from './package.json';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'App Converter',
  slug: 'currency-converter-app',
  version,
  orientation: 'portrait',
  icon: './src/assets/images/icon.png',
  scheme: 'currencyconverter',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: false,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E1F2E7',
      foregroundImage: './src/assets/images/android-icon-foreground.png',
      backgroundImage: './src/assets/images/android-icon-background.png',
      monochromeImage: './src/assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './src/assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#0F3D2E',
        image: './src/assets/images/splash-icon.png',
        imageWidth: 76,
      },
    ],
    'expo-localization',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
