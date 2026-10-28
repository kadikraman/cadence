import { ReactNode } from 'react';
import { Platform, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import SwipeRow, { SwipeAction } from '../../components/SwipeRow';
import { Task } from '../../lib/types';
import { completionStatusColor } from '../../utils/colorUtils';
import {
  cadenceDays,
  CurrentCycle,
  formatDriftLabel,
  HistoryEntry,
  stripUnit,
} from '../../utils/statsUtils';
import { formatMonthDay, formatWeekday } from '../../utils/taskUtils';
import DayStrip from './DayStrip';

interface CyclesListProps {
  task: Task;
  cycle: CurrentCycle | null;
  history: HistoryEntry[];
  accent: string;
  onEditEntry: (ts: number) => void;
  onDeleteEntry: (ts: number) => void;
}

export default function CyclesList({
  task,
  cycle,
  history,
  accent,
  onEditEntry,
  onDeleteEntry,
}: CyclesListProps) {
  const { theme } = useUnistyles();
  const cadDays = cadenceDays(task.cadence);
  const unit = stripUnit(cadDays);
  const cardColor = Platform.select({
    android: theme.colors.surface,
    default: theme.colors.surfaceElevated,
  });

  if (!cycle && history.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No completions yet.</Text>
      </View>
    );
  }

  const entryActions = (ts: number): SwipeAction[] => [
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
    <View>
      <View style={styles.head}>
        <Text style={styles.headTitle}>Cycles</Text>
        <Text style={styles.headNote}>one square per {unit.label}</Text>
      </View>
      <View style={[styles.card, { backgroundColor: cardColor }]}>
        {cycle && (
          <CycleRow
            title="Now"
            sub={`since ${formatMonthDay(cycle.start)}`}
            strip={
              <DayStrip
                kind="now"
                days={cycle.days}
                elapsed={cycle.elapsed}
                unit={unit}
                accent={accent}
              />
            }
            status={
              cycle.dueIn < 0 ? `${-cycle.dueIn}d over` : `${cycle.dueIn}d left`
            }
            statusColor={
              cycle.dueIn < 0 ? theme.colors.error : theme.colors.label3
            }
          />
        )}
        {history.map((entry, i) => (
          <View key={entry.completedAt}>
            {(cycle || i > 0) && <View style={styles.separator} />}
            <SwipeRow
              rightActions={entryActions(entry.completedAt)}
              backgroundColor={cardColor}
            >
              <CycleRow
                title={formatMonthDay(entry.completedAt)}
                sub={formatWeekday(entry.completedAt)}
                strip={
                  <DayStrip
                    kind="entry"
                    cadDays={cadDays}
                    deltaDays={entry.deltaDays}
                    status={entry.status}
                    unit={unit}
                    accent={accent}
                  />
                }
                status={
                  entry.deltaDays === null
                    ? 'first'
                    : formatDriftLabel(entry.deltaDays, cadDays).label
                }
                statusColor={
                  entry.status === 'first'
                    ? theme.colors.label3
                    : completionStatusColor(entry.status, theme.colors)
                }
              />
            </SwipeRow>
          </View>
        ))}
      </View>
    </View>
  );
}

function CycleRow({
  title,
  sub,
  strip,
  status,
  statusColor,
}: {
  title: string;
  sub: string;
  strip: ReactNode;
  status: string;
  statusColor: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.dateCol}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      <View style={styles.stripCol}>{strip}</View>
      <Text style={[styles.status, { color: statusColor }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  head: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 8,
  },
  headTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.label2,
    textTransform: 'uppercase',
    letterSpacing: 0.1,
  },
  headNote: {
    fontSize: 13,
    color: theme.colors.label3,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 22,
    overflow: 'hidden',
  },
  separator: {
    height: 0.5,
    marginLeft: 16,
    backgroundColor: theme.colors.sep,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  dateCol: {
    width: 82,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: theme.colors.text,
  },
  sub: {
    fontSize: 12,
    color: theme.colors.label3,
    marginTop: 1,
  },
  stripCol: {
    flex: 1,
    overflow: 'hidden',
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.label3,
  },
}));
