import { common } from './common';
import { converter } from './converter';
import { currencies } from './currencies';
import { errors } from './errors';
import { history } from './history';
import { rates } from './rates';
import { settings } from './settings';
import { tabs } from './tabs';
import { welcome } from './welcome';

export const ptBR = {
  common,
  tabs,
  converter,
  rates,
  history,
  settings,
  currencies,
  errors,
  welcome,
};

export type Translations = typeof ptBR;
