export interface Colors {
  primary: string;
  accent: string;
  accentSoft: string;
  background: string;
  surfacePrimary: string;
  surfaceAlternate: string;
  mintSoft: string;
  textPrimary: string;
  textHeading: string;
  textSecondary: string;
  textMuted: string;
  textWeak: string;
  border: string;
  borderStrong: string;
  divider: string;
  highlight: string;
  highlightText: string;
  warningBackground: string;
  warningText: string;
  successBackground: string;
  successText: string;
  statusSuccess: string;
  statusFailure: string;
  shadow: string;
  focusRing: string;
  white: string;
  surfaceBrand: string;
  textOnBrand: string;
  textOnBrandMuted: string;
  borderOnBrand: string;
  chipOnBrand: string;
  coinBorderOnBrand: string;
  coinTextOnBrand: string;
  textOnAccent: string;
}

const brand = {
  primary: '#0F3D2E',
  accent: '#9FE1CB',
  white: '#FFFFFF',
  surfaceBrand: '#0F3D2E',
  textOnBrand: '#FFFFFF',
  textOnBrandMuted: '#CFE3D6',
  borderOnBrand: 'rgba(255,255,255,0.32)',
  chipOnBrand: 'rgba(159,225,203,0.14)',
  coinBorderOnBrand: 'rgba(159,225,203,0.25)',
  coinTextOnBrand: 'rgba(159,225,203,0.45)',
  textOnAccent: '#0F3D2E',
} as const;

export const lightColors: Colors = {
  ...brand,
  accentSoft: '#E1F2E7',
  background: '#F3F7F4',
  surfacePrimary: '#FFFFFF',
  surfaceAlternate: '#F4F8F5',
  mintSoft: '#E1F2E7',
  textPrimary: '#14211B',
  textHeading: '#0F3D2E',
  textSecondary: '#4F5F57',
  textMuted: '#4F5F57',
  textWeak: '#8A9A91',
  border: '#DCE6DF',
  borderStrong: '#B9CCBF',
  divider: '#EDF2EE',
  highlight: '#1E7A52',
  highlightText: '#1E7A52',
  warningBackground: '#FDECDD',
  warningText: '#8A3A0A',
  successBackground: '#E1F2E7',
  successText: '#14532D',
  statusSuccess: '#1E7A52',
  statusFailure: '#C2410C',
  shadow: 'rgba(15,61,46,0.5)',
  focusRing: 'rgba(30,122,82,0.18)',
};

export const darkColors: Colors = {
  ...brand,
  accentSoft: '#173A2D',
  background: '#0B1411',
  surfacePrimary: '#14201B',
  surfaceAlternate: '#1A2822',
  mintSoft: '#173A2D',
  textPrimary: '#E6EFEA',
  textHeading: '#E3F1E9',
  textSecondary: '#A3B5AB',
  textMuted: '#A3B5AB',
  textWeak: '#7D9086',
  border: '#24332C',
  borderStrong: '#2F4139',
  divider: '#1F2D27',
  highlight: '#5CC995',
  highlightText: '#6FD3A2',
  warningBackground: '#3A2316',
  warningText: '#F7B98A',
  successBackground: '#173A2D',
  successText: '#9FE1CB',
  statusSuccess: '#4FC38A',
  statusFailure: '#F08A4B',
  shadow: 'rgba(0,0,0,0.55)',
  focusRing: 'rgba(159,225,203,0.28)',
};

export const SIZES = {
  screenPadding: 20,
  sectionGap: 24,
  itemGap: 12,
  cardPadding: 16,
  listRow: 64,
  button: 52,
  key: 44,
  touchTarget: 44,
  currencyIcon: 40,
} as const;

export const RADIUS = {
  card: 24,
  list: 20,
  button: 16,
  field: 16,
  icon: 12,
  key: 12,
  option: 12,
  pill: 999,
} as const;

export const TYPE = {
  display: 40,
  title: 32,
  section: 17,
  value: 18,
  body: 16,
  secondary: 13,
  caption: 12,
  tab: 11,
} as const;

export const FONTS = {
  display: 'BricolageGrotesque_600SemiBold',
  displayMedium: 'BricolageGrotesque_500Medium',
  body: 'InstrumentSans_400Regular',
  bodyMedium: 'InstrumentSans_500Medium',
  bodySemiBold: 'InstrumentSans_600SemiBold',
} as const;
