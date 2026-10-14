import { config as loadEnv } from 'dotenv';
import type { ConfigContext, ExpoConfig } from 'expo/config';

import { version } from './package.json';

type AppVariant = 'production' | 'beta';

loadEnv({ path: '.env', quiet: true });

if (!process.env.EXPO_PUBLIC_API_URL) {
  throw new Error('Missing EXPO_PUBLIC_API_URL. Copy .env.example to .env and set the API URL.');
}

const variant: AppVariant = process.env.APP_VARIANT === 'beta' ? 'beta' : 'production';

const VARIANTS = {
  production: {
    name: 'Converter',
    scheme: 'currencyconverter',
    bundleIdentifier: 'com.aqu1no1.currencyconverter',
  },
  beta: {
    name: 'Converter Beta',
    scheme: 'currencyconverterbeta',
    bundleIdentifier: 'com.aqu1no1.currencyconverter.beta',
  },
} as const satisfies Record<AppVariant, { name: string; scheme: string; bundleIdentifier: string }>;

const { name, scheme, bundleIdentifier } = VARIANTS[variant];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name,
  slug: 'currency-converter-app',
  version,
  orientation: 'portrait',
  icon: './src/assets/images/icon.png',
  scheme,
  userInterfaceStyle: 'automatic',
  ios: {
    bundleIdentifier,
    supportsTablet: false,
  },
  android: {
    package: bundleIdentifier,
    adaptiveIcon: {
      foregroundImage: './src/assets/images/adaptive-icon.png',
      monochromeImage: './src/assets/images/adaptive-icon-monochrome.png',
      backgroundColor: '#0F3D2E',
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
        image: './src/assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#0F3D2E',
      },
    ],
    'expo-localization',
  ],
  extra: {
    variant,
  },
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
