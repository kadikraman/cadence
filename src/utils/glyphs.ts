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
  keywords: string[];
  hidden?: boolean;
}

export const GLYPHS: Record<GlyphKey, GlyphData> = {
  car: { symbol: 'car.fill', keywords: ['car', 'vehicle', 'auto', 'drive'] },
  bed: { symbol: 'bed.double.fill', keywords: ['bed', 'sleep', 'bedroom'] },
  toilet: {
    symbol: 'toilet.fill',
    keywords: ['toilet', 'bathroom', 'restroom', 'loo'],
  },
  kitchen: {
    symbol: 'fork.knife',
    keywords: ['kitchen', 'food', 'eat', 'meal', 'cook', 'utensils'],
  },
  entry: {
    symbol: 'house.fill',
    keywords: ['home', 'house', 'entry', 'apartment'],
  },
  dish: {
    symbol: 'dishwasher.fill',
    keywords: ['dish', 'dishwasher', 'kitchen'],
  },
  car_tax: {
    symbol: 'creditcard.fill',
    keywords: ['card', 'credit', 'tax', 'payment'],
    hidden: true,
  },
  pill: {
    symbol: 'pills.fill',
    keywords: ['pill', 'pills', 'medicine', 'medication', 'vitamin'],
  },
  plant: {
    symbol: 'leaf.fill',
    keywords: ['plant', 'leaf', 'garden', 'greenery', 'nature'],
  },
  workout: {
    symbol: 'figure.strengthtraining.traditional',
    keywords: ['workout', 'gym', 'strength', 'lift', 'exercise'],
  },
  trash: {
    symbol: 'trash.fill',
    keywords: ['trash', 'garbage', 'bin', 'waste', 'recycle'],
  },
  mail: {
    symbol: 'envelope.fill',
    keywords: ['mail', 'email', 'envelope', 'message', 'letter'],
  },
  phone: {
    symbol: 'phone.fill',
    keywords: ['phone', 'call', 'telephone'],
  },
  filter: {
    symbol: 'line.3.horizontal.decrease',
    keywords: ['filter', 'sort', 'list'],
  },
  heart: {
    symbol: 'heart.fill',
    keywords: ['heart', 'love', 'favorite', 'like'],
  },
  star: {
    symbol: 'star.fill',
    keywords: ['star', 'favorite', 'rating'],
  },
  book: {
    symbol: 'book.fill',
    keywords: ['book', 'read', 'reading', 'study'],
  },
  note: {
    symbol: 'note.text',
    keywords: ['note', 'notes', 'text', 'memo'],
  },
  shopping: {
    symbol: 'bag.fill',
    keywords: ['shopping', 'bag', 'groceries', 'errand'],
  },
  dumbbell: {
    symbol: 'dumbbell.fill',
    keywords: ['dumbbell', 'weights', 'gym', 'lift', 'fitness'],
  },
  run: {
    symbol: 'figure.run',
    keywords: ['run', 'running', 'jog', 'exercise', 'cardio'],
  },
  water: {
    symbol: 'drop.fill',
    keywords: ['water', 'drink', 'hydrate', 'drop'],
  },
  bath: {
    symbol: 'bathtub.fill',
    keywords: ['bath', 'bathtub', 'shower', 'bathroom'],
  },
  candle: {
    symbol: 'flame.fill',
    keywords: ['candle', 'flame', 'fire'],
    hidden: true,
  },
  leaf: {
    symbol: 'leaf.fill',
    keywords: ['leaf', 'plant', 'nature'],
    hidden: true,
  },
  tree: {
    symbol: 'tree.fill',
    keywords: ['tree', 'plant', 'forest', 'nature'],
  },
  pet: {
    symbol: 'pawprint.fill',
    keywords: ['pet', 'paw', 'animal', 'dog', 'cat'],
  },
  bike: {
    symbol: 'bicycle',
    keywords: ['bike', 'bicycle', 'cycle', 'ride'],
  },
  music: {
    symbol: 'music.note',
    keywords: ['music', 'note', 'song', 'audio'],
  },
  gift: {
    symbol: 'gift.fill',
    keywords: ['gift', 'present', 'birthday'],
  },
  lock: {
    symbol: 'lock.fill',
    keywords: ['lock', 'secure', 'security', 'password'],
  },
  globe: {
    symbol: 'globe',
    keywords: ['globe', 'world', 'internet', 'web'],
  },
  briefcase: {
    symbol: 'briefcase.fill',
    keywords: ['briefcase', 'work', 'office', 'job', 'business'],
  },
  droplet: {
    symbol: 'drop.fill',
    keywords: ['drop', 'droplet', 'water'],
    hidden: true,
  },
  sun: {
    symbol: 'sun.max.fill',
    keywords: ['sun', 'sunny', 'weather', 'bright', 'day'],
  },
  snow: {
    symbol: 'snowflake',
    keywords: ['snow', 'snowflake', 'cold', 'winter', 'ice'],
  },
  fire: {
    symbol: 'flame.fill',
    keywords: ['fire', 'flame', 'hot', 'burn', 'streak'],
  },
  clock: {
    symbol: 'clock.fill',
    keywords: ['clock', 'time', 'hour'],
  },
  wallet: {
    symbol: 'wallet.bifold.fill',
    keywords: ['wallet', 'money', 'cash', 'payment'],
  },
  card: {
    symbol: 'creditcard.fill',
    keywords: ['card', 'credit', 'payment', 'bill'],
  },
  gear: {
    symbol: 'gearshape.fill',
    keywords: ['gear', 'settings', 'config', 'options'],
  },
  tools: {
    symbol: 'wrench.and.screwdriver.fill',
    keywords: ['tools', 'wrench', 'screwdriver', 'repair', 'fix'],
  },
  sofa: {
    symbol: 'sofa.fill',
    keywords: ['sofa', 'couch', 'living', 'furniture'],
  },
  chair: {
    symbol: 'chair.fill',
    keywords: ['chair', 'seat', 'furniture'],
  },
  lamp: {
    symbol: 'lamp.desk.fill',
    keywords: ['lamp', 'light', 'desk'],
  },
  shower: {
    symbol: 'shower.fill',
    keywords: ['shower', 'bathroom', 'wash', 'bath'],
  },
  washer: {
    symbol: 'washer.fill',
    keywords: ['washer', 'laundry', 'wash', 'clothes'],
  },
  dryer: {
    symbol: 'dryer.fill',
    keywords: ['dryer', 'laundry', 'dry', 'clothes'],
  },
  oven: {
    symbol: 'oven.fill',
    keywords: ['oven', 'kitchen', 'bake', 'cook'],
  },
  microwave: {
    symbol: 'microwave.fill',
    keywords: ['microwave', 'kitchen', 'heat'],
  },
  fridge: {
    symbol: 'refrigerator.fill',
    keywords: ['fridge', 'refrigerator', 'kitchen', 'cold'],
  },
  coffee: {
    symbol: 'cup.and.saucer.fill',
    keywords: ['coffee', 'tea', 'drink', 'cup', 'mug'],
  },
  wine: {
    symbol: 'wineglass.fill',
    keywords: ['wine', 'drink', 'alcohol', 'glass'],
  },
  carrot: {
    symbol: 'carrot.fill',
    keywords: ['carrot', 'vegetable', 'food', 'garden'],
  },
  airplane: {
    symbol: 'airplane',
    keywords: ['airplane', 'plane', 'flight', 'travel'],
  },
  bus: {
    symbol: 'bus.fill',
    keywords: ['bus', 'transit', 'transport'],
  },
  fuel: {
    symbol: 'fuelpump.fill',
    keywords: ['fuel', 'gas', 'petrol', 'pump', 'car'],
  },
  laptop: {
    symbol: 'laptopcomputer',
    keywords: ['laptop', 'computer', 'mac', 'work'],
  },
  printer: {
    symbol: 'printer.fill',
    keywords: ['printer', 'print', 'office'],
  },
  camera: {
    symbol: 'camera.fill',
    keywords: ['camera', 'photo', 'picture'],
  },
  folder: {
    symbol: 'folder.fill',
    keywords: ['folder', 'files', 'organize'],
  },
  doc: {
    symbol: 'doc.text.fill',
    keywords: ['document', 'doc', 'paper', 'file', 'receipt'],
  },
  message: {
    symbol: 'message.fill',
    keywords: ['message', 'chat', 'text', 'sms'],
  },
  bell: {
    symbol: 'bell.fill',
    keywords: ['bell', 'notify', 'notification', 'alert'],
  },
  calendar: {
    symbol: 'calendar',
    keywords: ['calendar', 'date', 'schedule', 'event'],
  },
  alarm: {
    symbol: 'alarm.fill',
    keywords: ['alarm', 'clock', 'wake', 'timer'],
  },
  cart: {
    symbol: 'cart.fill',
    keywords: ['cart', 'shopping', 'groceries', 'store'],
  },
  dollar: {
    symbol: 'dollarsign.circle.fill',
    keywords: ['dollar', 'money', 'cash', 'finance', 'bill'],
  },
  walk: {
    symbol: 'figure.walk',
    keywords: ['walk', 'walking', 'step', 'exercise'],
  },
  hiking: {
    symbol: 'figure.hiking',
    keywords: ['hike', 'hiking', 'trail', 'outdoor'],
  },
  stethoscope: {
    symbol: 'stethoscope',
    keywords: ['stethoscope', 'doctor', 'health', 'medical', 'checkup'],
  },
  dog: {
    symbol: 'dog.fill',
    keywords: ['dog', 'pet', 'animal'],
  },
  cat: {
    symbol: 'cat.fill',
    keywords: ['cat', 'pet', 'animal'],
  },
  bird: {
    symbol: 'bird.fill',
    keywords: ['bird', 'pet', 'animal'],
  },
  fish: {
    symbol: 'fish.fill',
    keywords: ['fish', 'pet', 'animal', 'aquarium'],
  },
  cloud: {
    symbol: 'cloud.fill',
    keywords: ['cloud', 'weather'],
  },
  rain: {
    symbol: 'cloud.rain.fill',
    keywords: ['rain', 'weather', 'wet'],
  },
  moon: {
    symbol: 'moon.fill',
    keywords: ['moon', 'night', 'sleep'],
  },
  bolt: {
    symbol: 'bolt.fill',
    keywords: ['bolt', 'lightning', 'electric', 'power', 'energy'],
  },
  headphones: {
    symbol: 'headphones',
    keywords: ['headphones', 'audio', 'music', 'listen'],
  },
  guitar: {
    symbol: 'guitars.fill',
    keywords: ['guitar', 'music', 'instrument'],
  },
  books: {
    symbol: 'books.vertical.fill',
    keywords: ['books', 'library', 'read', 'study'],
  },
  graduation: {
    symbol: 'graduationcap.fill',
    keywords: ['graduation', 'school', 'study', 'education'],
  },
  bookmark: {
    symbol: 'bookmark.fill',
    keywords: ['bookmark', 'save', 'mark'],
  },
  flag: {
    symbol: 'flag.fill',
    keywords: ['flag', 'mark', 'important'],
  },
  tag: {
    symbol: 'tag.fill',
    keywords: ['tag', 'label', 'price'],
  },
  key: {
    symbol: 'key.fill',
    keywords: ['key', 'unlock', 'password'],
  },
  scissors: {
    symbol: 'scissors',
    keywords: ['scissors', 'cut', 'haircut'],
  },
};

export const GLYPH_KEYS: GlyphKey[] = Object.keys(GLYPHS) as GlyphKey[];

export const VISIBLE_GLYPH_KEYS: GlyphKey[] = GLYPH_KEYS.filter(
  k => !GLYPHS[k].hidden
);

export const getSymbol = (key: GlyphKey | undefined): SFSymbol =>
  (GLYPHS[key ?? 'entry'] ?? GLYPHS.entry).symbol;
