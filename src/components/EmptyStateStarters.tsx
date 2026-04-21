import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import TaskTile from './ui/TaskTile';
import { Cadence } from '../lib/storage';
import { GlyphKey } from '../utils/glyphs';
import { ColorKey } from '../utils/taskTints';

interface Starter {
  title: string;
  subtitle: string;
  cadence: Cadence;
  color: ColorKey;
  glyph: GlyphKey;
}

const STARTERS: Starter[] = [
  {
    title: 'Water the plants',
    subtitle: 'every 3 days',
    cadence: { type: 'custom', value: 3, unit: 'days' },
    color: 'green',
    glyph: 'plant',
  },
  {
    title: 'Take out the trash',
    subtitle: 'every week',
    cadence: { type: 'weekly' },
    color: 'slate',
    glyph: 'trash',
  },
  {
    title: 'Change bedsheets',
    subtitle: 'every 2 weeks',
    cadence: { type: 'custom', value: 2, unit: 'weeks' },
    color: 'purple',
    glyph: 'bed',
  },
  {
    title: 'Pay rent',
    subtitle: 'every month',
    cadence: { type: 'monthly' },
    color: 'orange',
    glyph: 'wallet',
  },
];

function buildStarterRoute(s: Starter): `/new?${string}` {
  const params = new URLSearchParams({
    title: s.title,
    cadenceType: s.cadence.type,
    color: s.color,
    glyph: s.glyph,
  });
  if (s.cadence.type === 'custom') {
    params.set('cadenceValue', String(s.cadence.value ?? 1));
    params.set('cadenceUnit', s.cadence.unit ?? 'days');
  }
  return `/new?${params.toString()}`;
}

export default function EmptyStateStarters() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const c = theme.colors;

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroRow}>
        <View
          style={[
            styles.mark,
            {
              backgroundColor: c.surfaceElevated,
              shadowColor: c.blue,
            },
          ]}
        >
          <SymbolView
            name="waveform.path.ecg"
            size={44}
            tintColor={c.blue}
            resizeMode="scaleAspectFit"
            fallback={null}
          />
        </View>
        <View style={styles.heroText}>
          <Text style={[styles.heroTitle, { color: c.text }]}>
            Build your rhythm
          </Text>
          <Text style={[styles.heroSubtitle, { color: c.label2 }]}>
            Track the things you do on a loop. Start with one of these, or make
            your own.
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionLabel, { color: c.label3 }]}>
        Popular starters
      </Text>

      <View style={[styles.card, { backgroundColor: c.surfaceElevated }]}>
        {STARTERS.map((s, i) => (
          <View key={s.title}>
            <Pressable
              onPress={() => router.push(buildStarterRoute(s))}
              style={({ pressed }) => [
                styles.starterRow,
                pressed && { backgroundColor: c.fill4 },
              ]}
            >
              <TaskTile color={s.color} glyph={s.glyph} size={36} />
              <View style={styles.starterText}>
                <Text style={[styles.starterTitle, { color: c.text }]}>
                  {s.title}
                </Text>
                <Text style={[styles.starterSub, { color: c.label3 }]}>
                  {s.subtitle}
                </Text>
              </View>
              <View
                style={[styles.addChip, { backgroundColor: c.blue + '22' }]}
              >
                <SymbolView
                  name="plus"
                  size={12}
                  tintColor={c.blue}
                  resizeMode="scaleAspectFit"
                  fallback={null}
                />
              </View>
            </Pressable>
            {i < STARTERS.length - 1 && (
              <View
                style={[styles.separator, { backgroundColor: c.sepSubtle }]}
              />
            )}
          </View>
        ))}
      </View>

      <Pressable
        onPress={() => router.push('/new')}
        style={({ pressed }) => [
          styles.customRow,
          { backgroundColor: c.blue + '14' },
          pressed && { opacity: 0.7 },
        ]}
      >
        <View style={[styles.customIcon, { backgroundColor: c.blue }]}>
          <SymbolView
            name="plus"
            size={16}
            tintColor="#fff"
            resizeMode="scaleAspectFit"
            fallback={null}
          />
        </View>
        <Text style={[styles.customLabel, { color: c.blue }]}>
          Create your own task
        </Text>
        <SymbolView
          name="chevron.right"
          size={12}
          tintColor={c.blue}
          resizeMode="scaleAspectFit"
          fallback={null}
        />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 40,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 4,
    paddingBottom: 14,
  },
  mark: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 23,
  },
  heroSubtitle: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 17,
    letterSpacing: -0.1,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    paddingHorizontal: 4,
    paddingTop: 10,
    paddingBottom: 8,
  },
  card: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  starterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  starterText: {
    flex: 1,
  },
  starterTitle: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  starterSub: {
    fontSize: 12,
    marginTop: 1,
  },
  addChip: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 0.5,
    marginLeft: 60,
  },
  customRow: {
    marginTop: 12,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
});
