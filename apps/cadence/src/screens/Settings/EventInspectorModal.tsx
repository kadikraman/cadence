import { SymbolView } from 'expo-symbols';
import Observe, { AppMetrics } from 'expo-observe';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type Session = Awaited<
  ReturnType<typeof AppMetrics.getInactiveSessions>
>[number];
type LogRecord = Session['logs'][number];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function EventInspectorModal({ visible, onClose }: Props) {
  const { theme, rt } = useUnistyles();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<null | 'flush' | 'clear'>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [prevVisible, setPrevVisible] = useState(visible);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const all = await AppMetrics.getInactiveSessions();
      setSessions(all);
    } catch (err) {
      setLastAction(`Refresh failed: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setLastAction(null);
      refresh();
    }
  }

  const flush = async () => {
    setBusy('flush');
    try {
      await Observe.dispatchEvents();
      setLastAction('Flushed at ' + new Date().toLocaleTimeString());
      await refresh();
    } catch (err) {
      setLastAction(`Flush failed: ${(err as Error).message}`);
    } finally {
      setBusy(null);
    }
  };

  const clear = async () => {
    setBusy('clear');
    try {
      await AppMetrics.clearStoredEntries();
      setLastAction('Cleared at ' + new Date().toLocaleTimeString());
      await refresh();
    } catch (err) {
      setLastAction(`Clear failed: ${(err as Error).message}`);
    } finally {
      setBusy(null);
    }
  };

  const totalLogs = sessions.reduce((n, s) => n + s.logs.length, 0);
  const totalMetrics = sessions.reduce((n, s) => n + s.metrics.length, 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.root, { paddingTop: rt.insets.top }]}>
        <View style={styles.nav}>
          <Text style={styles.title}>Event Inspector</Text>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <SymbolView
              name="xmark.circle.fill"
              size={28}
              tintColor={theme.colors.label3}
              resizeMode="scaleAspectFit"
              fallback={null}
            />
          </Pressable>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {sessions.length} session{sessions.length === 1 ? '' : 's'} ·{' '}
            {totalLogs} log{totalLogs === 1 ? '' : 's'} · {totalMetrics} metric
            {totalMetrics === 1 ? '' : 's'}
          </Text>
          {lastAction && <Text style={styles.lastAction}>{lastAction}</Text>}
        </View>

        <View style={styles.actions}>
          <ActionButton
            label="Refresh"
            onPress={refresh}
            disabled={loading || busy !== null}
          />
          <ActionButton
            label={busy === 'flush' ? 'Flushing…' : 'Force flush'}
            onPress={flush}
            disabled={loading || busy !== null}
            primary
          />
          <ActionButton
            label={busy === 'clear' ? 'Clearing…' : 'Clear'}
            onPress={clear}
            disabled={loading || busy !== null}
            destructive
          />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {loading && sessions.length === 0 ? (
            <ActivityIndicator style={styles.spinner} />
          ) : sessions.length === 0 ? (
            <Text style={styles.empty}>No sessions stored.</Text>
          ) : (
            sessions.map((session, i) => (
              <SessionBlock key={session.id} session={session} index={i} />
            ))
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  primary?: boolean;
  destructive?: boolean;
}

function ActionButton({
  label,
  onPress,
  disabled,
  primary,
  destructive,
}: ActionButtonProps) {
  const { theme } = useUnistyles();
  const tint = destructive
    ? theme.colors.error
    : primary
      ? theme.colors.blue
      : theme.colors.label2;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.actionBtn,
        { borderColor: tint },
        disabled && { opacity: 0.4 },
      ]}
    >
      <Text style={[styles.actionLabel, { color: tint }]}>{label}</Text>
    </Pressable>
  );
}

function SessionBlock({ session, index }: { session: Session; index: number }) {
  const start = new Date(session.startDate).toLocaleString();
  const end = session.endDate
    ? new Date(session.endDate).toLocaleTimeString()
    : 'live';
  return (
    <View style={styles.sessionBlock}>
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionTitle}>
          {index === 0 ? 'Current ' : ''}#{index} · {session.type}
        </Text>
        <Text style={styles.sessionMeta}>
          {session.logs.length}L / {session.metrics.length}M
        </Text>
      </View>
      <Text style={styles.sessionSub}>
        {start} → {end}
      </Text>
      <Text style={styles.sessionId} numberOfLines={1}>
        {session.id}
      </Text>
      {session.logs.length === 0 ? (
        <Text style={[styles.empty, { marginTop: 8 }]}>
          No logs in this session.
        </Text>
      ) : (
        session.logs.map((log, i) => (
          <LogRow key={`${session.id}-${i}`} log={log} />
        ))
      )}
    </View>
  );
}

function LogRow({ log }: { log: LogRecord }) {
  const { theme } = useUnistyles();
  const time = new Date(log.timestamp).toLocaleTimeString();
  const sevColor =
    log.severity === 'error' || log.severity === 'fatal'
      ? theme.colors.error
      : log.severity === 'warn'
        ? theme.colors.warning
        : theme.colors.label3;
  const attrs = log.attributes ? JSON.stringify(log.attributes, null, 2) : null;
  return (
    <View style={styles.logRow}>
      <View style={styles.logHeader}>
        <Text style={styles.logName} numberOfLines={1}>
          {log.name}
        </Text>
        <Text style={[styles.logSeverity, { color: sevColor }]}>
          {log.severity}
        </Text>
      </View>
      <Text style={styles.logTime}>{time}</Text>
      {log.body ? <Text style={styles.logBody}>{log.body}</Text> : null}
      {attrs ? <Text style={styles.logAttrs}>{attrs}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 0.2,
  },
  closeBtn: {
    padding: 4,
  },
  summary: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  summaryText: {
    fontSize: 13,
    color: theme.colors.label2,
  },
  lastAction: {
    fontSize: 12,
    color: theme.colors.label3,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
  },
  spinner: {
    marginTop: 40,
  },
  empty: {
    textAlign: 'center',
    color: theme.colors.label3,
    fontSize: 14,
    marginTop: 24,
  },
  sessionBlock: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  sessionMeta: {
    fontSize: 12,
    color: theme.colors.label3,
    fontVariant: ['tabular-nums'],
  },
  sessionSub: {
    fontSize: 12,
    color: theme.colors.label2,
  },
  sessionId: {
    fontSize: 11,
    color: theme.colors.label4,
    fontFamily: 'Menlo',
  },
  logRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.sepSubtle,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: 'Menlo',
  },
  logSeverity: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  logTime: {
    fontSize: 11,
    color: theme.colors.label3,
    marginTop: 1,
  },
  logBody: {
    fontSize: 12,
    color: theme.colors.label2,
    marginTop: 4,
  },
  logAttrs: {
    fontSize: 11,
    color: theme.colors.label2,
    marginTop: 4,
    fontFamily: 'Menlo',
  },
}));
