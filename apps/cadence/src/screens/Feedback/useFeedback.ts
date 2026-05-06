import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { logs } from '../../lib/logs';

export type Kind = 'feedback' | 'feature' | 'bug';

export interface KindOption {
  k: Kind;
  label: string;
  symbol: Parameters<typeof SymbolView>[0]['name'];
  tint: string;
}

export const KINDS: KindOption[] = [
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

export const PLACEHOLDERS: Record<Kind, string> = {
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

export function useFeedback() {
  const router = useRouter();
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
      Sentry.captureException(err);
      logs.feedbackSendFailed(kind, err);
    } finally {
      setSending(false);
    }
  };

  return {
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
  };
}
