import { useObserve } from 'expo-observe';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialButton from '../../components/ui/android/MaterialButton';
import NativeSwitch from '../../components/ui/NativeSwitch';
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

const SYNC_STEP: Step = {
  title: 'Sync with Google Drive',
  body: 'Keep your tasks and to-dos up to date on every Android device with your Google account. They are saved in a hidden app folder in your own Google Drive. Cadence has no server and cannot see them.',
  visual: 'sync',
};

export default function OnboardingScreen() {
  const { theme, rt } = useUnistyles();
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
        <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
          {current.title}
        </Text>
        <Text style={[styles.stepBody, { color: theme.colors.label2 }]}>
          {current.body}
        </Text>
        {current.visual === 'sync' && (
          <View
            style={[styles.syncRow, { backgroundColor: theme.colors.surface }]}
          >
            <View style={styles.syncText}>
              <Text style={[styles.syncLabel, { color: theme.colors.text }]}>
                Sync with Google Drive
              </Text>
              <Text style={[styles.syncSub, { color: theme.colors.label2 }]}>
                {sync.account ?? 'You will be asked to sign in with Google.'}
              </Text>
            </View>
            <NativeSwitch
              value={sync.enabled}
              onValueChange={sync.setEnabled}
            />
          </View>
        )}
      </View>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(56, rt.insets.bottom + 32) },
        ]}
      >
        <View style={styles.dotRow}>
          {steps.map((_, i) => (
            <Dot key={i} isActive={i === step} />
          ))}
        </View>
        <MaterialButton onPress={next}>
          {step === steps.length - 1 ? 'Done' : 'Next'}
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
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 28,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    alignSelf: 'stretch',
  },
  syncText: {
    flex: 1,
  },
  syncLabel: {
    fontSize: 16,
  },
  syncSub: {
    fontSize: 13,
    marginTop: 2,
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
