import 'i18next';

import type { Translations } from '@locales/pt-BR';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: { translation: Translations };
  }
}
