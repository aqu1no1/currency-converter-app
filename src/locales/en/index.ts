import type { Translations } from '@locales/pt-BR';

export const en: Translations = {
  common: {
    appName: 'Converter',
    comingSoon: 'Coming soon',
  },
  errors: {
    network: 'No connection to the server. Check your internet and try again.',
    timeout: 'The server took too long to respond. Try again.',
    invalidResponse: 'We got an unexpected response from the server.',
    unexpected: 'Something went wrong. Try again.',
  },
  welcome: {
    description:
      'Convert between 10 currencies with central bank rates, updated every day and with history since 2000.',
    start: 'Get started',
    convertNow: 'Convert now',
    disclaimer: 'Reference rates. Spread and fees not included.',
  },
};
