export type ColorKey =
  | 'blue'
  | 'cyan'
  | 'indigo'
  | 'purple'
  | 'lavender'
  | 'pink'
  | 'rose'
  | 'orange'
  | 'peach'
  | 'yellow'
  | 'olive'
  | 'green'
  | 'forest'
  | 'teal'
  | 'mint'
  | 'red'
  | 'maroon'
  | 'brown'
  | 'slate'
  | 'gray';

export interface Tint {
  tint: string;
  tintDark: string;
  accent: string;
}

export const TINTS: Record<ColorKey, Tint> = {
  blue: {
    tint: '#E8F1FF',
    tintDark: 'rgba(10,132,255,0.18)',
    accent: '#0A84FF',
  },
  cyan: {
    tint: '#DCF1FF',
    tintDark: 'rgba(50,173,230,0.22)',
    accent: '#32ADE6',
  },
  indigo: {
    tint: '#ECEBFF',
    tintDark: 'rgba(94,92,230,0.20)',
    accent: '#5E5CE6',
  },
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
  pink: {
    tint: '#FFE9EF',
    tintDark: 'rgba(255,55,95,0.18)',
    accent: '#FF375F',
  },
  rose: {
    tint: '#FFE0E4',
    tintDark: 'rgba(255,99,125,0.22)',
    accent: '#E64D6A',
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
  red: {
    tint: '#FFE5E5',
    tintDark: 'rgba(255,69,58,0.20)',
    accent: '#FF3B30',
  },
  maroon: {
    tint: '#F3D9D7',
    tintDark: 'rgba(155,50,60,0.25)',
    accent: '#8A2A32',
  },
  brown: {
    tint: '#EEE5DB',
    tintDark: 'rgba(172,142,104,0.22)',
    accent: '#AC8E68',
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

export const getTint = (key: ColorKey | undefined): Tint =>
  TINTS[key ?? 'gray'] ?? TINTS.gray;
