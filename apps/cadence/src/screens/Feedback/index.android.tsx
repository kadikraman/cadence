import { useObserve } from 'expo-observe';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons/static';
import Chip from '../../components/ui/android/Chip';
import MaterialButton from '../../components/ui/android/MaterialButton';
import MaterialTextField from '../../components/ui/android/MaterialTextField';
import TopAppBar from '../../components/ui/android/TopAppBar';
import { KINDS, PLACEHOLDERS, useFeedback } from './useFeedback';

export default function FeedbackScreen() {
  const { theme, rt } = useUnistyles();
  const c = theme.colors;
  const {
    router,
    kind,
    setKind,
    message,
    setMessage,
    email,
    setEmail,
    sent,
    canSend,
    version,
    submit,
  } = useFeedback();

  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  if (sent) {
    return (
      <View
        style={[
          styles.root,
          { paddingTop: rt.insets.top, backgroundColor: c.groupedBackground },
        ]}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.sentWrap}>
          <View style={[styles.sentBadge, { backgroundColor: c.primary }]}>
            <MaterialCommunityIcons
              name="check"
              size={48}
              color={c.onPrimary}
            />
          </View>
          <Text style={[styles.sentTitle, { color: c.text }]}>
            Thanks for writing in.
          </Text>
          <Text style={[styles.sentSub, { color: c.label2 }]}>
            We read every message. If you left an email, we&apos;ll reply within
            a few days.
          </Text>
          <View style={{ height: 24 }} />
          <MaterialButton onPress={() => router.back()}>
            Back to settings
          </MaterialButton>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.root,
        { paddingTop: rt.insets.top, backgroundColor: c.groupedBackground },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <TopAppBar
        title="Feedback"
        variant="small"
        onBack={() => router.back()}
        right={
          <MaterialButton
            onPress={submit}
            disabled={!canSend}
            variant={canSend ? 'filled' : 'outlined'}
            accessibilityLabel="Send feedback"
          >
            Send
          </MaterialButton>
        }
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
      >
        <Text style={[styles.intro, { color: c.label2 }]}>
          Tell us what&apos;s working, what&apos;s not, or what to build next.
          Goes straight to the team.
        </Text>
        <Text style={[styles.sectionLabel, { color: c.text }]}>
          What&apos;s this about?
        </Text>
        <View style={styles.chipRow}>
          {KINDS.map(o => (
            <Chip
              key={o.k}
              label={o.label}
              selected={kind === o.k}
              onPress={() => setKind(o.k)}
            />
          ))}
        </View>
        <Text style={[styles.sectionLabel, { color: c.text }]}>Message</Text>
        <MaterialTextField
          label="Your message"
          value={message}
          onChangeText={setMessage}
          placeholder={PLACEHOLDERS[kind]}
          multiline
        />
        <View style={{ height: 14 }} />
        <MaterialTextField
          label="Email (optional)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={[styles.footerNote, { color: c.label3 }]}>
          Sent with the app version ({version}) and platform ({Platform.OS}),
          nothing else.
        </Text>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  intro: {
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    paddingTop: 16,
    paddingBottom: 10,
    paddingHorizontal: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  footerNote: {
    fontSize: 12,
    lineHeight: 17,
    paddingTop: 16,
    paddingHorizontal: 4,
  },
  sentWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sentBadge: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentTitle: {
    fontSize: 28,
    fontWeight: '400',
    marginTop: 24,
    textAlign: 'center',
  },
  sentSub: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
    maxWidth: 300,
  },
});
