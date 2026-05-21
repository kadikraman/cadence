import { useObserve } from 'expo-observe';
import { Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import FormGroup from '../../components/ui/FormGroup';
import FormLabel from '../../components/ui/FormLabel';
import { KINDS, PLACEHOLDERS, useFeedback } from './useFeedback';

export default function FeedbackScreen() {
  const { theme } = useUnistyles();
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
});
