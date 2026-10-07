export interface Colors {
  primary: string;
  accent: string;
  accentSoft: string;
  background: string;
  surfacePrimary: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
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
  textPrimary: '#14211B',
  textSecondary: '#4F5F57',
  border: '#DCE6E0',
};

export const darkColors: Colors = {
  ...brand,
  accentSoft: '#1A4535',
  background: '#0B1F18',
  surfacePrimary: '#12291F',
  textPrimary: '#F3F7F4',
  textSecondary: '#A9BDB2',
  border: '#24423A',
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
