import type { SFSymbol } from 'expo-symbols';

export const DEFAULT_GLYPH = 'entry' as const;

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
  | 'tools'
  | 'sofa'
  | 'chair'
  | 'lamp'
  | 'shower'
  | 'washer'
  | 'dryer'
  | 'oven'
  | 'microwave'
  | 'fridge'
  | 'coffee'
  | 'wine'
  | 'carrot'
  | 'airplane'
  | 'bus'
  | 'fuel'
  | 'laptop'
  | 'printer'
  | 'camera'
  | 'folder'
  | 'doc'
  | 'message'
  | 'bell'
  | 'calendar'
  | 'alarm'
  | 'cart'
  | 'dollar'
  | 'walk'
  | 'hiking'
  | 'stethoscope'
  | 'dog'
  | 'cat'
  | 'bird'
  | 'fish'
  | 'cloud'
  | 'rain'
  | 'moon'
  | 'bolt'
  | 'headphones'
  | 'guitar'
  | 'books'
  | 'graduation'
  | 'bookmark'
  | 'flag'
  | 'tag'
  | 'key'
  | 'scissors';

export interface GlyphData {
  symbol: SFSymbol;
  materialIcon: string;
  keywords: string[];
  hidden?: boolean;
}

export const GLYPHS: Record<GlyphKey, GlyphData> = {
  car: {
    symbol: 'car.fill',
    materialIcon: 'car',
    keywords: ['car', 'vehicle', 'auto', 'drive'],
  },
  bed: {
    symbol: 'bed.double.fill',
    materialIcon: 'bed',
    keywords: ['bed', 'sleep', 'bedroom'],
  },
  toilet: {
    symbol: 'toilet.fill',
    materialIcon: 'toilet',
    keywords: ['toilet', 'bathroom', 'restroom', 'loo'],
  },
  kitchen: {
    symbol: 'fork.knife',
    materialIcon: 'silverware-fork-knife',
    keywords: ['kitchen', 'food', 'eat', 'meal', 'cook', 'utensils'],
  },
  entry: {
    symbol: 'house.fill',
    materialIcon: 'home',
    keywords: ['home', 'house', 'entry', 'apartment'],
  },
  dish: {
    symbol: 'dishwasher.fill',
    materialIcon: 'dishwasher',
    keywords: ['dish', 'dishwasher', 'kitchen'],
  },
  car_tax: {
    symbol: 'creditcard.fill',
    materialIcon: 'credit-card',
    keywords: ['card', 'credit', 'tax', 'payment'],
    hidden: true,
  },
  pill: {
    symbol: 'pills.fill',
    materialIcon: 'pill',
    keywords: ['pill', 'pills', 'medicine', 'medication', 'vitamin'],
  },
  plant: {
    symbol: 'leaf.fill',
    materialIcon: 'leaf',
    keywords: ['plant', 'leaf', 'garden', 'greenery', 'nature'],
  },
  workout: {
    symbol: 'figure.strengthtraining.traditional',
    materialIcon: 'weight-lifter',
    keywords: ['workout', 'gym', 'strength', 'lift', 'exercise'],
  },
  trash: {
    symbol: 'trash.fill',
    materialIcon: 'trash-can',
    keywords: ['trash', 'garbage', 'bin', 'waste', 'recycle'],
  },
  mail: {
    symbol: 'envelope.fill',
    materialIcon: 'email',
    keywords: ['mail', 'email', 'envelope', 'message', 'letter'],
  },
  phone: {
    symbol: 'phone.fill',
    materialIcon: 'phone',
    keywords: ['phone', 'call', 'telephone'],
  },
  filter: {
    symbol: 'line.3.horizontal.decrease',
    materialIcon: 'filter-variant',
    keywords: ['filter', 'sort', 'list'],
  },
  heart: {
    symbol: 'heart.fill',
    materialIcon: 'heart',
    keywords: ['heart', 'love', 'favorite', 'like'],
  },
  star: {
    symbol: 'star.fill',
    materialIcon: 'star',
    keywords: ['star', 'favorite', 'rating'],
  },
  book: {
    symbol: 'book.fill',
    materialIcon: 'book',
    keywords: ['book', 'read', 'reading', 'study'],
  },
  note: {
    symbol: 'note.text',
    materialIcon: 'note-text',
    keywords: ['note', 'notes', 'text', 'memo'],
  },
  shopping: {
    symbol: 'bag.fill',
    materialIcon: 'shopping',
    keywords: ['shopping', 'bag', 'groceries', 'errand'],
  },
  dumbbell: {
    symbol: 'dumbbell.fill',
    materialIcon: 'dumbbell',
    keywords: ['dumbbell', 'weights', 'gym', 'lift', 'fitness'],
  },
  run: {
    symbol: 'figure.run',
    materialIcon: 'run',
    keywords: ['run', 'running', 'jog', 'exercise', 'cardio'],
  },
  water: {
    symbol: 'drop.fill',
    materialIcon: 'water',
    keywords: ['water', 'drink', 'hydrate', 'drop'],
  },
  bath: {
    symbol: 'bathtub.fill',
    materialIcon: 'bathtub',
    keywords: ['bath', 'bathtub', 'shower', 'bathroom'],
  },
  candle: {
    symbol: 'flame.fill',
    materialIcon: 'candle',
    keywords: ['candle', 'flame', 'fire'],
    hidden: true,
  },
  leaf: {
    symbol: 'leaf.fill',
    materialIcon: 'leaf',
    keywords: ['leaf', 'plant', 'nature'],
    hidden: true,
  },
  tree: {
    symbol: 'tree.fill',
    materialIcon: 'tree',
    keywords: ['tree', 'plant', 'forest', 'nature'],
  },
  pet: {
    symbol: 'pawprint.fill',
    materialIcon: 'paw',
    keywords: ['pet', 'paw', 'animal', 'dog', 'cat'],
  },
  bike: {
    symbol: 'bicycle',
    materialIcon: 'bike',
    keywords: ['bike', 'bicycle', 'cycle', 'ride'],
  },
  music: {
    symbol: 'music.note',
    materialIcon: 'music-note',
    keywords: ['music', 'note', 'song', 'audio'],
  },
  gift: {
    symbol: 'gift.fill',
    materialIcon: 'gift',
    keywords: ['gift', 'present', 'birthday'],
  },
  lock: {
    symbol: 'lock.fill',
    materialIcon: 'lock',
    keywords: ['lock', 'secure', 'security', 'password'],
  },
  globe: {
    symbol: 'globe',
    materialIcon: 'earth',
    keywords: ['globe', 'world', 'internet', 'web'],
  },
  briefcase: {
    symbol: 'briefcase.fill',
    materialIcon: 'briefcase',
    keywords: ['briefcase', 'work', 'office', 'job', 'business'],
  },
  droplet: {
    symbol: 'drop.fill',
    materialIcon: 'water',
    keywords: ['drop', 'droplet', 'water'],
    hidden: true,
  },
  sun: {
    symbol: 'sun.max.fill',
    materialIcon: 'white-balance-sunny',
    keywords: ['sun', 'sunny', 'weather', 'bright', 'day'],
  },
  snow: {
    symbol: 'snowflake',
    materialIcon: 'snowflake',
    keywords: ['snow', 'snowflake', 'cold', 'winter', 'ice'],
  },
  fire: {
    symbol: 'flame.fill',
    materialIcon: 'fire',
    keywords: ['fire', 'flame', 'hot', 'burn', 'streak'],
  },
  clock: {
    symbol: 'clock.fill',
    materialIcon: 'clock',
    keywords: ['clock', 'time', 'hour'],
  },
  wallet: {
    symbol: 'wallet.bifold.fill',
    materialIcon: 'wallet',
    keywords: ['wallet', 'money', 'cash', 'payment'],
  },
  card: {
    symbol: 'creditcard.fill',
    materialIcon: 'credit-card',
    keywords: ['card', 'credit', 'payment', 'bill'],
  },
  gear: {
    symbol: 'gearshape.fill',
    materialIcon: 'cog',
    keywords: ['gear', 'settings', 'config', 'options'],
  },
  tools: {
    symbol: 'wrench.and.screwdriver.fill',
    materialIcon: 'wrench',
    keywords: ['tools', 'wrench', 'screwdriver', 'repair', 'fix'],
  },
  sofa: {
    symbol: 'sofa.fill',
    materialIcon: 'sofa',
    keywords: ['sofa', 'couch', 'living', 'furniture'],
  },
  chair: {
    symbol: 'chair.fill',
    materialIcon: 'chair-rolling',
    keywords: ['chair', 'seat', 'furniture'],
  },
  lamp: {
    symbol: 'lamp.desk.fill',
    materialIcon: 'lamp',
    keywords: ['lamp', 'light', 'desk'],
  },
  shower: {
    symbol: 'shower.fill',
    materialIcon: 'shower',
    keywords: ['shower', 'bathroom', 'wash', 'bath'],
  },
  washer: {
    symbol: 'washer.fill',
    materialIcon: 'washing-machine',
    keywords: ['washer', 'laundry', 'wash', 'clothes'],
  },
  dryer: {
    symbol: 'dryer.fill',
    materialIcon: 'tumble-dryer',
    keywords: ['dryer', 'laundry', 'dry', 'clothes'],
  },
  oven: {
    symbol: 'oven.fill',
    materialIcon: 'stove',
    keywords: ['oven', 'kitchen', 'bake', 'cook'],
  },
  microwave: {
    symbol: 'microwave.fill',
    materialIcon: 'microwave',
    keywords: ['microwave', 'kitchen', 'heat'],
  },
  fridge: {
    symbol: 'refrigerator.fill',
    materialIcon: 'fridge',
    keywords: ['fridge', 'refrigerator', 'kitchen', 'cold'],
  },
  coffee: {
    symbol: 'cup.and.saucer.fill',
    materialIcon: 'coffee',
    keywords: ['coffee', 'tea', 'drink', 'cup', 'mug'],
  },
  wine: {
    symbol: 'wineglass.fill',
    materialIcon: 'glass-wine',
    keywords: ['wine', 'drink', 'alcohol', 'glass'],
  },
  carrot: {
    symbol: 'carrot.fill',
    materialIcon: 'carrot',
    keywords: ['carrot', 'vegetable', 'food', 'garden'],
  },
  airplane: {
    symbol: 'airplane',
    materialIcon: 'airplane',
    keywords: ['airplane', 'plane', 'flight', 'travel'],
  },
  bus: {
    symbol: 'bus.fill',
    materialIcon: 'bus',
    keywords: ['bus', 'transit', 'transport'],
  },
  fuel: {
    symbol: 'fuelpump.fill',
    materialIcon: 'gas-station',
    keywords: ['fuel', 'gas', 'petrol', 'pump', 'car'],
  },
  laptop: {
    symbol: 'laptopcomputer',
    materialIcon: 'laptop',
    keywords: ['laptop', 'computer', 'mac', 'work'],
  },
  printer: {
    symbol: 'printer.fill',
    materialIcon: 'printer',
    keywords: ['printer', 'print', 'office'],
  },
  camera: {
    symbol: 'camera.fill',
    materialIcon: 'camera',
    keywords: ['camera', 'photo', 'picture'],
  },
  folder: {
    symbol: 'folder.fill',
    materialIcon: 'folder',
    keywords: ['folder', 'files', 'organize'],
  },
  doc: {
    symbol: 'doc.text.fill',
    materialIcon: 'file-document',
    keywords: ['document', 'doc', 'paper', 'file', 'receipt'],
  },
  message: {
    symbol: 'message.fill',
    materialIcon: 'message',
    keywords: ['message', 'chat', 'text', 'sms'],
  },
  bell: {
    symbol: 'bell.fill',
    materialIcon: 'bell',
    keywords: ['bell', 'notify', 'notification', 'alert'],
  },
  calendar: {
    symbol: 'calendar',
    materialIcon: 'calendar',
    keywords: ['calendar', 'date', 'schedule', 'event'],
  },
  alarm: {
    symbol: 'alarm.fill',
    materialIcon: 'alarm',
    keywords: ['alarm', 'clock', 'wake', 'timer'],
  },
  cart: {
    symbol: 'cart.fill',
    materialIcon: 'cart',
    keywords: ['cart', 'shopping', 'groceries', 'store'],
  },
  dollar: {
    symbol: 'dollarsign.circle.fill',
    materialIcon: 'currency-usd',
    keywords: ['dollar', 'money', 'cash', 'finance', 'bill'],
  },
  walk: {
    symbol: 'figure.walk',
    materialIcon: 'walk',
    keywords: ['walk', 'walking', 'step', 'exercise'],
  },
  hiking: {
    symbol: 'figure.hiking',
    materialIcon: 'hiking',
    keywords: ['hike', 'hiking', 'trail', 'outdoor'],
  },
  stethoscope: {
    symbol: 'stethoscope',
    materialIcon: 'stethoscope',
    keywords: ['stethoscope', 'doctor', 'health', 'medical', 'checkup'],
  },
  dog: {
    symbol: 'dog.fill',
    materialIcon: 'dog',
    keywords: ['dog', 'pet', 'animal'],
  },
  cat: {
    symbol: 'cat.fill',
    materialIcon: 'cat',
    keywords: ['cat', 'pet', 'animal'],
  },
  bird: {
    symbol: 'bird.fill',
    materialIcon: 'bird',
    keywords: ['bird', 'pet', 'animal'],
  },
  fish: {
    symbol: 'fish.fill',
    materialIcon: 'fish',
    keywords: ['fish', 'pet', 'animal', 'aquarium'],
  },
  cloud: {
    symbol: 'cloud.fill',
    materialIcon: 'cloud',
    keywords: ['cloud', 'weather'],
  },
  rain: {
    symbol: 'cloud.rain.fill',
    materialIcon: 'weather-rainy',
    keywords: ['rain', 'weather', 'wet'],
  },
  moon: {
    symbol: 'moon.fill',
    materialIcon: 'weather-night',
    keywords: ['moon', 'night', 'sleep'],
  },
  bolt: {
    symbol: 'bolt.fill',
    materialIcon: 'flash',
    keywords: ['bolt', 'lightning', 'electric', 'power', 'energy'],
  },
  headphones: {
    symbol: 'headphones',
    materialIcon: 'headphones',
    keywords: ['headphones', 'audio', 'music', 'listen'],
  },
  guitar: {
    symbol: 'guitars.fill',
    materialIcon: 'guitar-acoustic',
    keywords: ['guitar', 'music', 'instrument'],
  },
  books: {
    symbol: 'books.vertical.fill',
    materialIcon: 'bookshelf',
    keywords: ['books', 'library', 'read', 'study'],
  },
  graduation: {
    symbol: 'graduationcap.fill',
    materialIcon: 'school',
    keywords: ['graduation', 'school', 'study', 'education'],
  },
  bookmark: {
    symbol: 'bookmark.fill',
    materialIcon: 'bookmark',
    keywords: ['bookmark', 'save', 'mark'],
  },
  flag: {
    symbol: 'flag.fill',
    materialIcon: 'flag',
    keywords: ['flag', 'mark', 'important'],
  },
  tag: {
    symbol: 'tag.fill',
    materialIcon: 'tag',
    keywords: ['tag', 'label', 'price'],
  },
  key: {
    symbol: 'key.fill',
    materialIcon: 'key',
    keywords: ['key', 'unlock', 'password'],
  },
  scissors: {
    symbol: 'scissors',
    materialIcon: 'content-cut',
    keywords: ['scissors', 'cut', 'haircut'],
  },
};

export const GLYPH_KEYS: GlyphKey[] = Object.keys(GLYPHS) as GlyphKey[];

export const VISIBLE_GLYPH_KEYS: GlyphKey[] = GLYPH_KEYS.filter(
  k => !GLYPHS[k].hidden
);

export const getSymbol = (key: GlyphKey | undefined): SFSymbol =>
  (GLYPHS[key ?? 'entry'] ?? GLYPHS.entry).symbol;

export const getMaterialIcon = (key: GlyphKey | undefined): string =>
  (GLYPHS[key ?? 'entry'] ?? GLYPHS.entry).materialIcon;

// Map common SF Symbols used for UI chrome (not task glyphs) to Material
// equivalents so SymbolView's `fallback` can render a native Material icon on
// Android. Keep in sync with SF Symbols referenced in IconButton callsites.
export const UI_SYMBOL_TO_MATERIAL: Record<string, string> = {
  'chart.bar.fill': 'chart-bar',
  'gearshape.fill': 'cog',
  plus: 'plus',
  xmark: 'close',
  'chevron.left': 'chevron-left',
  'chevron.right': 'chevron-right',
  ellipsis: 'dots-horizontal',
  checkmark: 'check',
  'checkmark.circle.fill': 'check-circle',
  calendar: 'calendar',
  pencil: 'pencil',
  'clock.fill': 'history',
  'trash.fill': 'trash-can',
  'exclamationmark.triangle.fill': 'alert',
  'arrow.triangle.2.circlepath': 'repeat',
};
