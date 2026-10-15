import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';

type MaterialCommunityIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export const ICONS = {
  home: 'home-outline',
  converter: 'swap-horizontal',
  rates: 'format-list-bulleted',
  history: 'trending-up',
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
  serverDown: 'cloud-off-outline',
  pending: 'clock-outline',
  syncAlert: 'sync-alert',
  language: 'translate',
  appearance: 'theme-light-dark',
  themeLight: 'weather-sunny',
  themeDark: 'weather-night',
  currency: 'cash-multiple',
  info: 'information-outline',
  favorite: 'star-outline',
  favoriteActive: 'star',
  emptyHistory: 'calendar-search',
} as const satisfies Record<string, MaterialCommunityIconName>;

export type IconName = keyof typeof ICONS;
