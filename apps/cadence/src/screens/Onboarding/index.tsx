import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Step } from './types';
import { Dot, OnboardingVisual } from './visuals';
import { useOnboarding } from './useOnboarding';

const STEPS: Step[] = [
  {
    title: 'Find Cadence on your Home Screen',
    body: "The widget lives next to the app — a glance at what's due, no opening required.",
    visual: 'icon',
  },
  {
    title: 'Touch and hold the icon',
    body: 'Keep pressing until a menu appears, then tap one of the widget shapes at the top.',
    visual: 'menu',
  },
];

export default function OnboardingScreen() {
  const { rt } = useUnistyles();
  const { step, next, close, isReplay } = useOnboarding(STEPS.length);
  const current = STEPS[step];

  return (
    <View style={[styles.root, !isReplay && { paddingTop: rt.insets.top }]}>
      <View style={styles.topBar}>
        {!isReplay && (
          <Pressable onPress={close} hitSlop={8}>
            <Text style={styles.navText}>Skip</Text>
          </Pressable>
        )}
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

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    minHeight: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
    marginTop: 10,
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
