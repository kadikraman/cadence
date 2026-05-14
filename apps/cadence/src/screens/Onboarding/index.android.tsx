import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialButton from '../../components/ui/android/MaterialButton';
import { Step } from './types';
import { Dot, OnboardingVisual } from './visuals';
import { useOnboarding } from './useOnboarding';

const STEPS: Step[] = [
  {
    title: 'Touch and hold your home screen',
    body: 'A menu pops up with shortcuts. Tap "Widgets" to open the picker.',
    visual: 'home-menu',
  },
  {
    title: 'Search for Cadence',
    body: 'Type "cadence" in the widget picker, then expand the row.',
    visual: 'widget-picker',
  },
];

export default function OnboardingScreen() {
  const { theme, rt } = useUnistyles();
  const { step, next, close, isReplay } = useOnboarding(STEPS.length);
  const current = STEPS[step];

  return (
    <View style={[styles.root, !isReplay && { paddingTop: rt.insets.top }]}>
      <View style={styles.topBar}>
        {!isReplay && (
          <Pressable
            onPress={close}
            android_ripple={{
              color: theme.colors.fill2,
              borderless: false,
            }}
            style={styles.skipBtn}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
          >
            <Text style={[styles.skipText, { color: theme.colors.primary }]}>
              Skip
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.visualWrap}>
        <OnboardingVisual kind={current.visual} />
        <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
          {current.title}
        </Text>
        <Text style={[styles.stepBody, { color: theme.colors.label2 }]}>
          {current.body}
        </Text>
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
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
  },
  skipBtn: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  visualWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '400',
    letterSpacing: 0,
    textAlign: 'center',
    lineHeight: 32,
    marginTop: 32,
  },
  stepBody: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: 24,
    gap: 20,
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
}));
