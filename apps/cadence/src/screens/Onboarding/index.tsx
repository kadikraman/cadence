import { useObserve } from 'expo-observe';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import NativeSwitch from '../../components/ui/NativeSwitch';
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

const SYNC_STEP: Step = {
  title: 'Sync with iCloud',
  body: 'Keep your tasks and to-dos up to date on every iPhone signed in to your Apple ID. They are saved in your own iCloud storage. Cadence has no server and cannot see them.',
  visual: 'sync',
};

export default function OnboardingScreen() {
  const { rt } = useUnistyles();
  const { steps, current, step, next, isReplay, sync } = useOnboarding(
    STEPS,
    SYNC_STEP
  );

  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  return (
    <View style={[styles.root, !isReplay && { paddingTop: rt.insets.top }]}>
      <View style={styles.topBar} />

      <View style={styles.visualWrap}>
        <OnboardingVisual kind={current.visual} />
        <Text style={styles.stepTitle}>{current.title}</Text>
        <Text style={styles.stepBody}>{current.body}</Text>
        {current.visual === 'sync' && (
          <View style={styles.syncRow}>
            <View style={styles.syncText}>
              <Text style={styles.syncLabel}>Sync with iCloud</Text>
              <Text style={styles.syncSub}>
                You can change this later in Settings.
              </Text>
            </View>
            <NativeSwitch
              value={sync.enabled}
              onValueChange={sync.setEnabled}
            />
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.dotRow}>
          {steps.map((_, i) => (
            <Dot key={i} isActive={i === step} />
          ))}
        </View>
        <Pressable onPress={next} style={styles.nextBtn}>
          <Text style={styles.nextText}>
            {step === steps.length - 1 ? 'Done' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
    paddingLeft: rt.insets.left,
    paddingRight: rt.insets.right,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    minHeight: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceElevated,
    alignSelf: 'stretch',
  },
  syncText: {
    flex: 1,
  },
  syncLabel: {
    fontSize: 16,
    color: theme.colors.text,
  },
  syncSub: {
    fontSize: 12,
    color: theme.colors.label3,
    marginTop: 1,
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
