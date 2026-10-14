import type { Translations } from '@locales/pt-BR';

import { common } from './common';
import { converter } from './converter';
import { currencies } from './currencies';
import { errors } from './errors';
import { history } from './history';
import { home } from './home';
import { onboarding } from './onboarding';
import { rates } from './rates';
import { settings } from './settings';
import { tabs } from './tabs';
import { welcome } from './welcome';

export const en: Translations = {
  common,
  tabs,
  converter,
  rates,
  history,
  home,
  onboarding,
  settings,
  currencies,
  errors,
  welcome,
};
