import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';

type MaterialCommunityIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export const ICONS = {
  home: 'home-outline',
  homeActive: 'home',
  converter: 'swap-horizontal',
  rates: 'format-list-bulleted',
  history: 'chart-line',
  settings: 'tune-variant',
  swap: 'swap-vertical',
  arrowRight: 'arrow-right',
  chevronRight: 'chevron-right',
  chevronDown: 'chevron-down',
  backspace: 'backspace-outline',
  check: 'check',
  close: 'close',
  refresh: 'refresh',
  error: 'alert-circle-outline',
  offline: 'wifi-off',
  language: 'translate',
  appearance: 'theme-light-dark',
  currency: 'cash-multiple',
  info: 'information-outline',
  favorite: 'star-outline',
  favoriteActive: 'star',
} as const satisfies Record<string, MaterialCommunityIconName>;

export type IconName = keyof typeof ICONS;
