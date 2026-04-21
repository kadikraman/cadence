export type ColorKey =
  | 'purple'
  | 'lavender'
  | 'plum'
  | 'orange'
  | 'peach'
  | 'amber'
  | 'clay'
  | 'yellow'
  | 'olive'
  | 'moss'
  | 'green'
  | 'forest'
  | 'sage'
  | 'teal'
  | 'mint'
  | 'brown'
  | 'stone'
  | 'dune'
  | 'slate'
  | 'gray';

export interface Tint {
  tint: string;
  tintDark: string;
  accent: string;
}

export const TINTS: Record<ColorKey, Tint> = {
  purple: {
    tint: '#F4EAFF',
    tintDark: 'rgba(175,82,222,0.20)',
    accent: '#AF52DE',
  },
  lavender: {
    tint: '#F0E7FB',
    tintDark: 'rgba(191,155,237,0.22)',
    accent: '#B085E0',
  },
  plum: {
    tint: '#EADFE6',
    tintDark: 'rgba(123,75,107,0.24)',
    accent: '#7B4B6B',
  },
  orange: {
    tint: '#FFEFD9',
    tintDark: 'rgba(255,159,10,0.20)',
    accent: '#FF9500',
  },
  peach: {
    tint: '#FFE6D4',
    tintDark: 'rgba(255,175,120,0.25)',
    accent: '#E8915A',
  },
  amber: {
    tint: '#FAE8C6',
    tintDark: 'rgba(217,162,76,0.22)',
    accent: '#D9A24C',
  },
  clay: {
    tint: '#F1DDCF',
    tintDark: 'rgba(181,118,92,0.24)',
    accent: '#B5765C',
  },
  yellow: {
    tint: '#FFF6D1',
    tintDark: 'rgba(255,214,10,0.20)',
    accent: '#FFCC00',
  },
  olive: {
    tint: '#EDEFC8',
    tintDark: 'rgba(168,182,96,0.24)',
    accent: '#8E9C4A',
  },
  moss: {
    tint: '#DFE3CA',
    tintDark: 'rgba(111,122,61,0.26)',
    accent: '#6F7A3D',
  },
  green: {
    tint: '#DCF5E3',
    tintDark: 'rgba(48,209,88,0.20)',
    accent: '#34C759',
  },
  forest: {
    tint: '#D4E6D8',
    tintDark: 'rgba(56,127,80,0.24)',
    accent: '#2E6A42',
  },
  sage: {
    tint: '#E2EAE1',
    tintDark: 'rgba(139,168,137,0.24)',
    accent: '#8BA889',
  },
  teal: {
    tint: '#D6F0F2',
    tintDark: 'rgba(64,200,224,0.20)',
    accent: '#30B0C7',
  },
  mint: {
    tint: '#D1F5EB',
    tintDark: 'rgba(0,199,190,0.20)',
    accent: '#00C7BE',
  },
  brown: {
    tint: '#EEE5DB',
    tintDark: 'rgba(172,142,104,0.22)',
    accent: '#AC8E68',
  },
  stone: {
    tint: '#E9E5E0',
    tintDark: 'rgba(154,145,135,0.24)',
    accent: '#9A9187',
  },
  dune: {
    tint: '#F1E9D8',
    tintDark: 'rgba(201,178,140,0.26)',
    accent: '#C9B28C',
  },
  slate: {
    tint: '#DEE4EA',
    tintDark: 'rgba(100,116,139,0.26)',
    accent: '#4E5A6C',
  },
  gray: {
    tint: '#EBEBEF',
    tintDark: 'rgba(142,142,147,0.22)',
    accent: '#8E8E93',
  },
};

export const COLOR_KEYS: ColorKey[] = Object.keys(TINTS) as ColorKey[];

export const DEFAULT_TINT_KEY: ColorKey = 'slate';

export const getTint = (key: ColorKey | string | undefined): Tint => {
  if (!key) return TINTS[DEFAULT_TINT_KEY];
  return TINTS[key as ColorKey] ?? TINTS[DEFAULT_TINT_KEY];
};
