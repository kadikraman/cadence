import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialButton from '../../components/ui/android/MaterialButton';
import { Dot, OnboardingVisual } from './visuals';
import { Step, useOnboarding } from './useOnboarding';

const STEPS: Step[] = [
  {
    title: 'Cadence on your home screen',
    body: "No notifications, no nagging. Just a glance at what's due.",
    visual: 'hero',
  },
  {
    title: 'Touch and hold your home screen',
    body: 'Tap "Widgets" when the menu appears.',
    visual: 'jiggle',
  },
  {
    title: 'Find Cadence',
    body: 'Widgets are grouped by app. Scroll or search for Cadence.',
    visual: 'plus',
  },
  {
    title: 'Drag your favorite size',
    body: 'Touch and hold a widget, then drop it where you want it.',
    visual: 'sizes',
  },
];

export default function OnboardingScreen() {
  const { theme, rt } = useUnistyles();
  const { step, next, back, close, isReplay } = useOnboarding(STEPS.length);
  const current = STEPS[step];

  return (
    <View style={[styles.root, !isReplay && { paddingTop: rt.insets.top }]}>
      <View style={styles.topBar}>
        {step > 0 ? (
          <Pressable
            onPress={back}
            android_ripple={{
              color: theme.colors.fill2,
              borderless: true,
              radius: 24,
            }}
            style={styles.iconBtn}
            accessibilityLabel="Previous step"
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={26}
              color={theme.colors.text}
            />
          </Pressable>
        ) : (
          <View style={styles.iconBtn} />
        )}
        <View style={{ flex: 1 }} />
        {!isReplay && step < STEPS.length - 1 && (
          <MaterialButton onPress={close} variant="outlined">
            Skip
          </MaterialButton>
        )}
      </View>

      <View style={styles.visualWrap}>
        <OnboardingVisual kind={current.visual} />
        <Text style={styles.stepTitle}>{current.title}</Text>
        <Text style={styles.stepBody}>{current.body}</Text>
      </View>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(56, rt.insets.bottom + 32) },
        ]}
      >
        <View style={styles.dotRow}>
          {STEPS.map((_, i) => (
            <Dot key={i} isActive={i === step} />
          ))}
        </View>
        <MaterialButton onPress={next} full>
          {step === STEPS.length - 1 ? 'Done' : 'Next'}
        </MaterialButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  iconBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
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
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 20,
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
}));
