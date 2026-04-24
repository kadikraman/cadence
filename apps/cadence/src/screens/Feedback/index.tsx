import Constants from 'expo-constants';
import { Stack, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Chip from '../../components/ui/android/Chip';
import MaterialButton from '../../components/ui/android/MaterialButton';
import MaterialTextField from '../../components/ui/android/MaterialTextField';
import TopAppBar from '../../components/ui/android/TopAppBar';
import FormGroup from '../../components/ui/FormGroup';
import FormLabel from '../../components/ui/FormLabel';

type Kind = 'feedback' | 'feature' | 'bug';

interface KindOption {
  k: Kind;
  label: string;
  symbol: Parameters<typeof SymbolView>[0]['name'];
  tint: string;
}

const IS_ANDROID = Platform.OS === 'android';

const KINDS: KindOption[] = [
  {
    k: 'feedback',
    label: 'General feedback',
    symbol: 'bubble.left.fill',
    tint: '#007AFF',
  },
  {
    k: 'feature',
    label: 'Feature request',
    symbol: 'sparkles',
    tint: '#AF52DE',
  },
  {
    k: 'bug',
    label: 'Bug report',
    symbol: 'exclamationmark.triangle.fill',
    tint: '#FF9500',
  },
];

const PLACEHOLDERS: Record<Kind, string> = {
  feedback: 'What do you think of Cadence so far?',
  feature: "What's missing? What would make this perfect for you?",
  bug: 'What happened, and what did you expect instead?',
};

function getApiBase(): string {
  if (__DEV__) {
    return '';
  }
  return 'https://expokadi-cadence.expo.app';
}

export default function FeedbackScreen() {
  const router = useRouter();
  const { theme, rt } = useUnistyles();
  const c = theme.colors;

  const [kind, setKind] = useState<Kind>('feedback');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const canSend = message.trim().length >= 4 && !sending;

  const version = useMemo(() => Constants.expoConfig?.version ?? '1.0', []);

  const submit = async () => {
    if (!canSend) return;
    setSending(true);
    try {
      const res = await fetch(`${getApiBase()}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: kind,
          message: message.trim(),
          email: email.trim() || undefined,
          platform: Platform.OS,
          version,
        }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setSent(true);
    } catch (err) {
      Alert.alert(
        'Could not send',
        "We couldn't reach the server. Please try again.",
        [{ text: 'OK' }]
      );
      console.warn('feedback send failed', err);
    } finally {
      setSending(false);
    }
  };

  if (IS_ANDROID) {
    if (sent) {
      return (
        <View
          style={[
            styles.root,
            { paddingTop: rt.insets.top, backgroundColor: c.groupedBackground },
          ]}
        >
          <Stack.Screen options={{ headerShown: false }} />
          <View style={styles.androidSentWrap}>
            <View
              style={[styles.androidSentBadge, { backgroundColor: c.primary }]}
            >
              <MaterialCommunityIcons
                name="check"
                size={48}
                color={c.onPrimary}
              />
            </View>
            <Text style={[styles.androidSentTitle, { color: c.text }]}>
              Thanks for writing in.
            </Text>
            <Text style={[styles.androidSentSub, { color: c.label2 }]}>
              We read every message. If you left an email, we&apos;ll reply
              within a few days.
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
          contentContainerStyle={styles.androidScroll}
          keyboardShouldPersistTaps="handled"
          bottomOffset={20}
        >
          <Text style={[styles.androidIntro, { color: c.label2 }]}>
            Tell us what&apos;s working, what&apos;s not, or what to build next.
            Goes straight to the team.
          </Text>
          <Text style={[styles.androidSectionLabel, { color: c.text }]}>
            What&apos;s this about?
          </Text>
          <View style={styles.androidChipRow}>
            {KINDS.map(o => (
              <Chip
                key={o.k}
                label={o.label}
                selected={kind === o.k}
                onPress={() => setKind(o.k)}
              />
            ))}
          </View>
          <Text style={[styles.androidSectionLabel, { color: c.text }]}>
            Message
          </Text>
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
          <Text style={[styles.androidFooterNote, { color: c.label3 }]}>
            Sent with the app version ({version}) and platform ({Platform.OS}),
            nothing else.
          </Text>
        </KeyboardAwareScrollView>
      </View>
    );
  }

  if (sent) {
    return (
      <View style={[styles.root, { backgroundColor: c.groupedBackground }]}>
        <Stack.Screen
          options={{
            title: '',
            headerBackVisible: false,
            headerRight: () => (
              <Pressable onPress={() => router.back()} hitSlop={10}>
                <Text style={{ color: c.blue, fontSize: 17 }}>Done</Text>
              </Pressable>
            ),
          }}
        />
        <View style={styles.sentWrap}>
          <View style={styles.sentBadge}>
            <SymbolView
              name="checkmark"
              size={42}
              tintColor="#fff"
              resizeMode="scaleAspectFit"
              fallback={null}
            />
          </View>
          <Text style={[styles.sentTitle, { color: c.text }]}>
            Thanks for writing in.
          </Text>
          <Text style={[styles.sentSub, { color: c.label2 }]}>
            We read every message. If you left an email, we&apos;ll reply within
            a few days.
          </Text>
        </View>
        <View style={styles.sentFooter}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.primaryBtn, { backgroundColor: c.blue }]}
          >
            <Text style={styles.primaryBtnText}>Back to Settings</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: c.groupedBackground }]}>
      <Stack.Screen
        options={{
          title: 'Feedback',
          headerRight: () => (
            <Pressable onPress={submit} disabled={!canSend} hitSlop={10}>
              <Text
                style={{
                  color: canSend ? c.blue : c.label4,
                  fontSize: 17,
                  fontWeight: '600',
                }}
              >
                Send
              </Text>
            </Pressable>
          ),
        }}
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

        <FormLabel>What&apos;s this about?</FormLabel>
        <FormGroup>
          {KINDS.map((o, i) => {
            const selected = kind === o.k;
            return (
              <Pressable
                key={o.k}
                onPress={() => setKind(o.k)}
                style={[
                  styles.kindRow,
                  i > 0 && {
                    borderTopWidth: 0.5,
                    borderTopColor: c.sepSubtle,
                  },
                ]}
              >
                <View
                  style={[styles.kindIcon, { backgroundColor: o.tint + '22' }]}
                >
                  <SymbolView
                    name={o.symbol}
                    size={16}
                    tintColor={o.tint}
                    resizeMode="scaleAspectFit"
                    fallback={null}
                  />
                </View>
                <Text style={[styles.kindLabel, { color: c.text }]}>
                  {o.label}
                </Text>
                {selected && (
                  <SymbolView
                    name="checkmark"
                    size={18}
                    tintColor={c.blue}
                    resizeMode="scaleAspectFit"
                    fallback={null}
                  />
                )}
              </Pressable>
            );
          })}
        </FormGroup>

        <FormLabel>Message</FormLabel>
        <FormGroup>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder={PLACEHOLDERS[kind]}
            placeholderTextColor={c.label3}
            multiline
            style={[styles.textarea, { color: c.text }]}
          />
        </FormGroup>

        <FormLabel>Email (optional)</FormLabel>
        <FormGroup>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="So we can reply"
            placeholderTextColor={c.label3}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[styles.input, { color: c.text }]}
          />
        </FormGroup>

        <Text style={[styles.footerNote, { color: c.label3 }]}>
          Your message is sent along with the app version ({version}) and
          platform ({Platform.OS}) - nothing else.
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
    paddingTop: 4,
    paddingBottom: 40,
  },
  intro: {
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    letterSpacing: -0.1,
  },
  kindRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  kindIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kindLabel: {
    flex: 1,
    fontSize: 16,
    letterSpacing: -0.2,
  },
  textarea: {
    minHeight: 140,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    letterSpacing: -0.2,
  },
  footerNote: {
    fontSize: 12,
    lineHeight: 17,
    paddingHorizontal: 20,
    paddingTop: 10,
    letterSpacing: -0.05,
  },
  sentWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  sentBadge: {
    width: 84,
    height: 84,
    borderRadius: 22,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  sentTitle: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  sentSub: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
    maxWidth: 300,
  },
  sentFooter: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  primaryBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  androidScroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  androidIntro: {
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  androidSectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    paddingTop: 16,
    paddingBottom: 10,
    paddingHorizontal: 4,
  },
  androidChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  androidFooterNote: {
    fontSize: 12,
    lineHeight: 17,
    paddingTop: 16,
    paddingHorizontal: 4,
  },
  androidSentWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  androidSentBadge: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  androidSentTitle: {
    fontSize: 28,
    fontWeight: '400',
    marginTop: 24,
    textAlign: 'center',
  },
  androidSentSub: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
    maxWidth: 300,
  },
});
