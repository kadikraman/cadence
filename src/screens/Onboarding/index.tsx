import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import WidgetPreview from '../../components/WidgetPreview';
import { Task } from '../../lib/types';
import { useSettingsStore } from '../../stores/settings';

type Visual = 'hero' | 'jiggle' | 'plus' | 'sizes';

interface Step {
  title: string;
  body: string;
  visual: Visual;
}

const STEPS: Step[] = [
  {
    title: 'Cadence lives on your Home Screen',
    body: "No notifications, no nagging. Just a glance at what's due.",
    visual: 'hero',
  },
  {
    title: 'Long-press your Home Screen',
    body: 'Keep pressing until the app icons start to jiggle.',
    visual: 'jiggle',
  },
  {
    title: 'Tap the + in the corner',
    body: 'Then search for "Cadence" in the widget gallery.',
    visual: 'plus',
  },
  {
    title: 'Pick your size',
    body: 'Small shows your next task. Medium shows three.',
    visual: 'sizes',
  },
];

const today = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
})();

const PREVIEW_TASKS: Task[] = [
  {
    id: 'preview-1',
    title: 'Water plants',
    color: 'green',
    glyph: 'plant',
    cadence: { type: 'custom', value: 3, unit: 'days' },
    createdAt: today - 30 * 86400000,
    lastCompletedAt: today - 3 * 86400000,
    nextDueDate: today,
    completedDates: [today - 3 * 86400000],
  },
  {
    id: 'preview-2',
    title: 'Pay car tax',
    color: 'slate',
    glyph: 'car',
    cadence: { type: 'monthly' },
    createdAt: today - 60 * 86400000,
    nextDueDate: today + 2 * 86400000,
    completedDates: [],
  },
  {
    id: 'preview-3',
    title: 'Clean the dishwasher',
    color: 'purple',
    glyph: 'trash',
    cadence: { type: 'monthly' },
    createdAt: today - 60 * 86400000,
    nextDueDate: today + 6 * 86400000,
    completedDates: [],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { rt } = useUnistyles();
  const setOnboardingSeen = useSettingsStore(s => s.setOnboardingSeen);
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isReplay = router.canGoBack();

  const close = async () => {
    await setOnboardingSeen();
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };
  const next = () => (step === STEPS.length - 1 ? close() : setStep(step + 1));
  const back = () => setStep(s => Math.max(0, s - 1));

  return (
    <View style={[styles.root, !isReplay && { paddingTop: rt.insets.top }]}>
      <View style={styles.topBar}>
        <View style={styles.topBarSide}>
          {step > 0 && (
            <Pressable onPress={back}>
              <Text style={styles.navText}>Back</Text>
            </Pressable>
          )}
        </View>
        <View style={[styles.topBarSide, styles.topBarRight]}>
          {!isReplay && (
            <Pressable onPress={close}>
              <Text style={styles.navText}>Skip</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.visualWrap}>
        <OnboardingVisual kind={current.visual} />
        <Text style={styles.stepTitle}>{current.title}</Text>
        <Text style={styles.stepBody}>{current.body}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dotRow}>
          {STEPS.map((_, i) => (
            <Dot key={i} isActive={i === step} />
          ))}
        </View>
        <Pressable onPress={next} style={styles.nextBtn}>
          <Text style={styles.nextText}>
            {step === STEPS.length - 1 ? 'Done' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Dot({ isActive }: { isActive: boolean }) {
  const { theme } = useUnistyles();
  const animatedStyle = useAnimatedStyle(
    () => ({
      width: withTiming(isActive ? 22 : 6, { duration: 220 }),
      backgroundColor: withTiming(
        isActive ? theme.colors.blue : theme.colors.fill2,
        { duration: 220 }
      ),
    }),
    [isActive, theme.colors.blue, theme.colors.fill2]
  );
  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

function OnboardingVisual({ kind }: { kind: Visual }) {
  const { theme, rt } = useUnistyles();
  const dark = rt.themeName === 'dark';

  if (kind === 'hero') {
    return (
      <View style={[visualStyles.hero, { shadowColor: theme.colors.blue }]}>
        <SymbolView
          name="square.grid.2x2.fill"
          size={80}
          tintColor="#fff"
          resizeMode="scaleAspectFit"
          fallback={null}
        />
      </View>
    );
  }
  if (kind === 'jiggle') {
    return (
      <View
        style={[
          visualStyles.jigglePane,
          {
            backgroundColor: dark ? theme.colors.surface : '#fff',
            borderColor: theme.colors.sep,
          },
        ]}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={i}
            style={[
              visualStyles.jiggleTile,
              {
                backgroundColor:
                  i === 3 ? theme.colors.blue : theme.colors.fill3,
                transform: [{ rotate: i % 2 === 0 ? '-2deg' : '2deg' }],
              },
            ]}
          />
        ))}
      </View>
    );
  }
  if (kind === 'plus') {
    return (
      <View
        style={[
          visualStyles.plusPane,
          { backgroundColor: theme.colors.surfaceElevated },
        ]}
      >
        <View
          style={[
            visualStyles.plusBadge,
            { backgroundColor: theme.colors.blue },
          ]}
        >
          <SymbolView
            name="plus"
            size={22}
            tintColor="#fff"
            resizeMode="scaleAspectFit"
            fallback={null}
          />
        </View>
        <View style={visualStyles.plusGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <View
              key={i}
              style={[
                visualStyles.plusSlot,
                { backgroundColor: theme.colors.fill3 },
              ]}
            />
          ))}
        </View>
      </View>
    );
  }
  return (
    <View style={visualStyles.sizes}>
      <WidgetPreview size="small" tasks={PREVIEW_TASKS} scale={0.75} />
      <WidgetPreview size="medium" tasks={PREVIEW_TASKS} scale={0.6} />
    </View>
  );
}

const visualStyles = StyleSheet.create(() => ({
  hero: {
    width: 200,
    height: 200,
    borderRadius: 44,
    backgroundColor: '#0A84FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.25,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 20 },
  },
  jigglePane: {
    width: 240,
    height: 180,
    borderRadius: 22,
    padding: 12,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignContent: 'center',
  },
  jiggleTile: {
    width: 45,
    height: 45,
    borderRadius: 10,
  },
  plusPane: {
    width: 200,
    height: 200,
    borderRadius: 24,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 8 },
  },
  plusBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusGrid: {
    marginTop: 62,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  plusSlot: {
    width: 82,
    height: 54,
    borderRadius: 10,
  },
  sizes: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
}));

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarSide: {
    flex: 1,
  },
  topBarRight: {
    alignItems: 'flex-end',
  },
  navText: {
    color: theme.colors.blue,
    fontSize: 17,
    padding: 4,
  },
  visualWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: -0.5,
    textAlign: 'center',
    lineHeight: 30,
    marginTop: 30,
  },
  stepBody: {
    fontSize: 16,
    color: theme.colors.label2,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 18,
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  nextBtn: {
    backgroundColor: theme.colors.blue,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}));
