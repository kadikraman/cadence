import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import SwipeRow, { SwipeAction } from '../../components/SwipeRow';
import { Task } from '../../lib/types';
import { cadenceDays, formatDriftLabel } from '../../utils/statsUtils';
import { relativeLabel } from '../../utils/taskUtils';

interface TimelineViewProps {
  task: Task;
  completedDates: number[];
  onEditEntry: (ts: number) => void;
  onDeleteEntry: (ts: number) => void;
}

const MS_DAY = 86400000;

export default function TimelineView({
  task,
  completedDates,
  onEditEntry,
  onDeleteEntry,
}: TimelineViewProps) {
  const { theme } = useUnistyles();
  const cadDays = cadenceDays(task.cadence);

  if (completedDates.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No completions yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {completedDates.map((ts, i) => {
        const next = completedDates[i + 1];
        const delta = next ? (ts - next) / MS_DAY : null;
        const drift = delta !== null ? formatDriftLabel(delta, cadDays) : null;
        const label = relativeLabel(ts);
        const d = new Date(ts);
        const timeLabel = d.toLocaleString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        const fullLabel = d.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        const isLast = i === completedDates.length - 1;
        const dotColor = !drift
          ? theme.colors.label3
          : drift.status === 'onTime'
            ? theme.colors.success
            : drift.status === 'late'
              ? theme.colors.warning
              : theme.colors.blue;
        const statusColor = dotColor;

        const entryActions: SwipeAction[] = [
          {
            label: 'Edit',
            symbol: 'pencil',
            color: theme.colors.blue,
            onPress: () => onEditEntry(ts),
          },
          {
            label: 'Delete',
            symbol: 'trash.fill',
            color: theme.colors.error,
            onPress: () => onDeleteEntry(ts),
          },
        ];

        return (
          <View key={ts}>
            <SwipeRow rightActions={entryActions}>
              <View style={styles.entry}>
                <View style={styles.track}>
                  <View style={[styles.dot, { backgroundColor: dotColor }]} />
                  {!isLast && (
                    <View
                      style={[
                        styles.line,
                        { backgroundColor: theme.colors.sep },
                      ]}
                    />
                  )}
                </View>
                <View style={styles.content}>
                  <View style={styles.row1}>
                    <Text style={styles.label}>{label}</Text>
                    {drift && (
                      <Text style={[styles.status, { color: statusColor }]}>
                        {drift.label}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.subLabel}>
                    {fullLabel} · {timeLabel}
                  </Text>
                </View>
              </View>
            </SwipeRow>
            {!isLast && (
              <View
                style={[
                  styles.separator,
                  { backgroundColor: theme.colors.sepSubtle },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  card: {
    marginHorizontal: 16,
    marginTop: 4,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 14,
    overflow: 'hidden',
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.label3,
  },
  entry: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  track: {
    width: 22,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  line: {
    flex: 1,
    width: 1.5,
    marginTop: 2,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'lowercase',
  },
  subLabel: {
    fontSize: 12,
    color: theme.colors.label3,
    marginTop: 2,
  },
  separator: {
    height: 0.5,
    marginLeft: 44,
  },
}));
