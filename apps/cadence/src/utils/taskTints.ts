// `accentDark` should be the foreground used in dark mode; for vivid accents
// it's the same as `accent`, for dim ones (slate, charcoal, navy, forest, ...)
// it's a lighter sibling so the icon reads against the dark tint.

export const DEFAULT_COLOR = 'slate' as const;

export type ColorKey =
  | 'purple'
  | 'lavender'
  | 'plum'
  | 'violet'
  | 'magenta'
  | 'indigo'
  | 'pink'
  | 'rose'
  | 'coral'
  | 'red'
  | 'crimson'
  | 'orange'
  | 'peach'
  | 'amber'
  | 'clay'
  | 'rust'
  | 'copper'
  | 'yellow'
  | 'gold'
  | 'olive'
  | 'moss'
  | 'lime'
  | 'green'
  | 'forest'
  | 'sage'
  | 'jade'
  | 'mint'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'cobalt'
  | 'navy'
  | 'brown'
  | 'stone'
  | 'dune'
  | 'slate'
  | 'gray'
  | 'charcoal'
  | 'ink';

export interface Tint {
  tint: string;
  tintDark: string;
  accent: string;
  accentDark: string;
}

export const TINTS: Record<ColorKey, Tint> = {
  purple: {
    tint: '#F4EAFF',
    tintDark: 'rgba(175,82,222,0.20)',
    accent: '#AF52DE',
    accentDark: '#AF52DE',
  },
  lavender: {
    tint: '#F0E7FB',
    tintDark: 'rgba(191,155,237,0.22)',
    accent: '#B085E0',
    accentDark: '#B085E0',
  },
  plum: {
    tint: '#EADFE6',
    tintDark: 'rgba(123,75,107,0.24)',
    accent: '#7B4B6B',
    accentDark: '#C28FA5',
  },
  violet: {
    tint: '#EBE0F7',
    tintDark: 'rgba(142,78,198,0.22)',
    accent: '#8E4EC6',
    accentDark: '#8E4EC6',
  },
  magenta: {
    tint: '#F8DDEC',
    tintDark: 'rgba(193,53,132,0.22)',
    accent: '#C13584',
    accentDark: '#C13584',
  },
  indigo: {
    tint: '#E0E0F9',
    tintDark: 'rgba(88,86,214,0.22)',
    accent: '#5856D6',
    accentDark: '#5856D6',
  },
  pink: {
    tint: '#FFDCE4',
    tintDark: 'rgba(255,45,85,0.20)',
    accent: '#FF2D55',
    accentDark: '#FF2D55',
  },
  rose: {
    tint: '#F7E3EB',
    tintDark: 'rgba(226,156,179,0.28)',
    accent: '#E29CB3',
    accentDark: '#E29CB3',
  },
  coral: {
    tint: '#FFDED2',
    tintDark: 'rgba(249,116,84,0.22)',
    accent: '#F97454',
    accentDark: '#F97454',
  },
  red: {
    tint: '#FFDAD6',
    tintDark: 'rgba(255,59,48,0.20)',
    accent: '#FF3B30',
    accentDark: '#FF3B30',
  },
  crimson: {
    tint: '#EED0D3',
    tintDark: 'rgba(184,58,75,0.26)',
    accent: '#B83A4B',
    accentDark: '#E27484',
  },
  orange: {
    tint: '#FFEFD9',
    tintDark: 'rgba(255,159,10,0.20)',
    accent: '#FF9500',
    accentDark: '#FF9500',
  },
  peach: {
    tint: '#FFE6D4',
    tintDark: 'rgba(255,175,120,0.25)',
    accent: '#E8915A',
    accentDark: '#E8915A',
  },
  amber: {
    tint: '#FAE8C6',
    tintDark: 'rgba(217,162,76,0.22)',
    accent: '#D9A24C',
    accentDark: '#D9A24C',
  },
  clay: {
    tint: '#F1DDCF',
    tintDark: 'rgba(181,118,92,0.24)',
    accent: '#B5765C',
    accentDark: '#B5765C',
  },
  rust: {
    tint: '#EAD4CA',
    tintDark: 'rgba(168,89,60,0.26)',
    accent: '#A8593C',
    accentDark: '#D08568',
  },
  copper: {
    tint: '#EFD9CC',
    tintDark: 'rgba(193,119,87,0.24)',
    accent: '#C17757',
    accentDark: '#C17757',
  },
  yellow: {
    tint: '#FFF6D1',
    tintDark: 'rgba(255,214,10,0.20)',
    accent: '#FFCC00',
    accentDark: '#FFCC00',
  },
  gold: {
    tint: '#F7EBC9',
    tintDark: 'rgba(212,168,75,0.22)',
    accent: '#D4A84B',
    accentDark: '#D4A84B',
  },
  olive: {
    tint: '#EDEFC8',
    tintDark: 'rgba(168,182,96,0.24)',
    accent: '#8E9C4A',
    accentDark: '#B6C470',
  },
  moss: {
    tint: '#DFE3CA',
    tintDark: 'rgba(111,122,61,0.26)',
    accent: '#6F7A3D',
    accentDark: '#A8B575',
  },
  lime: {
    tint: '#EBF2C8',
    tintDark: 'rgba(163,191,62,0.24)',
    accent: '#A3BF3E',
    accentDark: '#A3BF3E',
  },
  green: {
    tint: '#DCF5E3',
    tintDark: 'rgba(48,209,88,0.20)',
    accent: '#34C759',
    accentDark: '#34C759',
  },
  forest: {
    tint: '#D4E6D8',
    tintDark: 'rgba(56,127,80,0.24)',
    accent: '#2E6A42',
    accentDark: '#6FAA81',
  },
  sage: {
    tint: '#E2EAE1',
    tintDark: 'rgba(139,168,137,0.24)',
    accent: '#8BA889',
    accentDark: '#8BA889',
  },
  jade: {
    tint: '#D1E8E0',
    tintDark: 'rgba(46,139,114,0.24)',
    accent: '#2E8B72',
    accentDark: '#5FB89B',
  },
  mint: {
    tint: '#D1F5EB',
    tintDark: 'rgba(0,199,190,0.20)',
    accent: '#00C7BE',
    accentDark: '#00C7BE',
  },
  teal: {
    tint: '#D6F0F2',
    tintDark: 'rgba(64,200,224,0.20)',
    accent: '#30B0C7',
    accentDark: '#30B0C7',
  },
  cyan: {
    tint: '#CFEFF6',
    tintDark: 'rgba(34,196,228,0.22)',
    accent: '#22C4E4',
    accentDark: '#22C4E4',
  },
  sky: {
    tint: '#D9ECF7',
    tintDark: 'rgba(92,182,232,0.22)',
    accent: '#5CB6E8',
    accentDark: '#5CB6E8',
  },
  blue: {
    tint: '#D6E6FB',
    tintDark: 'rgba(10,132,255,0.22)',
    accent: '#0A84FF',
    accentDark: '#0A84FF',
  },
  cobalt: {
    tint: '#D4DEEF',
    tintDark: 'rgba(41,85,181,0.26)',
    accent: '#2955B5',
    accentDark: '#6E91D6',
  },
  navy: {
    tint: '#D2D8E1',
    tintDark: 'rgba(31,58,95,0.30)',
    accent: '#1F3A5F',
    accentDark: '#7C95B8',
  },
  brown: {
    tint: '#EEE5DB',
    tintDark: 'rgba(172,142,104,0.22)',
    accent: '#AC8E68',
    accentDark: '#AC8E68',
  },
  stone: {
    tint: '#E9E5E0',
    tintDark: 'rgba(154,145,135,0.24)',
    accent: '#9A9187',
    accentDark: '#9A9187',
  },
  dune: {
    tint: '#F1E9D8',
    tintDark: 'rgba(201,178,140,0.26)',
    accent: '#C9B28C',
    accentDark: '#C9B28C',
  },
  slate: {
    tint: '#DEE4EA',
    tintDark: 'rgba(100,116,139,0.26)',
    accent: '#4E5A6C',
    accentDark: '#94A3B8',
  },
  gray: {
    tint: '#EBEBEF',
    tintDark: 'rgba(142,142,147,0.22)',
    accent: '#8E8E93',
    accentDark: '#8E8E93',
  },
  charcoal: {
    tint: '#DCDCDF',
    tintDark: 'rgba(74,74,79,0.32)',
    accent: '#4A4A4F',
    accentDark: '#989899',
  },
  ink: {
    tint: '#D5D5D8',
    tintDark: 'rgba(44,44,48,0.34)',
    accent: '#2C2C30',
    accentDark: '#8E8E94',
  },
};

export const COLOR_KEYS: ColorKey[] = Object.keys(TINTS) as ColorKey[];

export const DEFAULT_TINT_KEY: ColorKey = 'slate';

export const getTint = (key: ColorKey | string | undefined): Tint => {
  if (!key) return TINTS[DEFAULT_TINT_KEY];
  return TINTS[key as ColorKey] ?? TINTS[DEFAULT_TINT_KEY];
};
