import type { SFSymbol } from 'expo-symbols';

export type GlyphKey =
  | 'car'
  | 'bed'
  | 'toilet'
  | 'kitchen'
  | 'entry'
  | 'dish'
  | 'car_tax'
  | 'pill'
  | 'plant'
  | 'workout'
  | 'trash'
  | 'mail'
  | 'phone'
  | 'filter'
  | 'heart'
  | 'star'
  | 'book'
  | 'note'
  | 'shopping'
  | 'dumbbell'
  | 'run'
  | 'water'
  | 'bath'
  | 'candle'
  | 'leaf'
  | 'tree'
  | 'pet'
  | 'bike'
  | 'music'
  | 'gift'
  | 'lock'
  | 'globe'
  | 'briefcase'
  | 'droplet'
  | 'sun'
  | 'snow'
  | 'fire'
  | 'clock'
  | 'wallet'
  | 'card'
  | 'gear'
  | 'tools';

export const GLYPHS: Record<GlyphKey, SFSymbol> = {
  car: 'car.fill',
  bed: 'bed.double.fill',
  toilet: 'toilet.fill',
  kitchen: 'fork.knife',
  entry: 'house.fill',
  dish: 'dishwasher.fill',
  car_tax: 'creditcard.fill',
  pill: 'pills.fill',
  plant: 'leaf.fill',
  workout: 'figure.strengthtraining.traditional',
  trash: 'trash.fill',
  mail: 'envelope.fill',
  phone: 'phone.fill',
  filter: 'line.3.horizontal.decrease',
  heart: 'heart.fill',
  star: 'star.fill',
  book: 'book.fill',
  note: 'note.text',
  shopping: 'bag.fill',
  dumbbell: 'dumbbell.fill',
  run: 'figure.run',
  water: 'drop.fill',
  bath: 'bathtub.fill',
  candle: 'flame.fill',
  leaf: 'leaf.fill',
  tree: 'tree.fill',
  pet: 'pawprint.fill',
  bike: 'bicycle',
  music: 'music.note',
  gift: 'gift.fill',
  lock: 'lock.fill',
  globe: 'globe',
  briefcase: 'briefcase.fill',
  droplet: 'drop.fill',
  sun: 'sun.max.fill',
  snow: 'snowflake',
  fire: 'flame.fill',
  clock: 'clock.fill',
  wallet: 'wallet.bifold.fill',
  card: 'creditcard.fill',
  gear: 'gearshape.fill',
  tools: 'wrench.and.screwdriver.fill',
};

export const GLYPH_KEYS: GlyphKey[] = Object.keys(GLYPHS) as GlyphKey[];

export const getSymbol = (key: GlyphKey | undefined): SFSymbol =>
  GLYPHS[key ?? 'entry'] ?? GLYPHS.entry;
