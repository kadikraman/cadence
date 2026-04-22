import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Task } from '../lib/types';
import { formatDueIn, getNextDueDate, getTaskStatus } from '../utils/taskUtils';
import TaskTile from './ui/TaskTile';

interface WidgetPreviewProps {
  size: 'small' | 'medium';
  tasks: Task[];
  scale?: number;
}

export default function WidgetPreview({
  size,
  tasks,
  scale = 1,
}: WidgetPreviewProps) {
  const { theme } = useUnistyles();
  const sorted = [...tasks].sort(
    (a, b) => getNextDueDate(a) - getNextDueDate(b)
  );
  const active = sorted.filter(t => getTaskStatus(t) !== 'completed');
  const display = active.length > 0 ? active : sorted;

  if (size === 'small') {
    const t = display[0];
    const status = t ? getTaskStatus(t) : null;
    const overdue = status === 'overdue';
    const remaining = active.length;

    return (
      <View
        style={[
          styles.shell,
          {
            width: 158 * scale,
            height: 158 * scale,
            borderRadius: 22 * scale,
            padding: 14 * scale,
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.brand, { fontSize: 13 * scale }]}>Cadence</Text>
          <Text style={[styles.big, { fontSize: 20 * scale }]}>
            {remaining}
          </Text>
        </View>
        {t ? (
          <View style={styles.smallBody}>
            <TaskTile task={t} size={28 * scale} overdue={overdue} />
            <View style={styles.smallText}>
              <Text
                style={[styles.title, { fontSize: 13 * scale }]}
                numberOfLines={1}
              >
                {t.title}
              </Text>
              <Text
                style={[
                  styles.due,
                  {
                    fontSize: 11 * scale,
                    color: overdue
                      ? theme.colors.error
                      : status === 'dueToday'
                        ? theme.colors.blue
                        : theme.colors.label3,
                  },
                ]}
              >
                {formatDueIn(getNextDueDate(t))}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.allClear}>
            <Text style={{ color: theme.colors.label3, fontSize: 13 }}>
              All clear
            </Text>
          </View>
        )}
      </View>
    );
  }

  const rows = display.slice(0, 3);
  return (
    <View
      style={[
        styles.shell,
        {
          width: 338 * scale,
          height: 158 * scale,
          borderRadius: 22 * scale,
          padding: 14 * scale,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.brand, { fontSize: 13 * scale }]}>Cadence</Text>
        <Text style={[styles.counter, { fontSize: 11 * scale }]}>
          {active.length} to do
        </Text>
      </View>
      <View style={styles.mediumBody}>
        {rows.map(t => {
          const status = getTaskStatus(t);
          const overdue = status === 'overdue';
          return (
            <View key={t.id} style={styles.mediumRow}>
              <TaskTile task={t} size={24 * scale} overdue={overdue} />
              <Text
                style={[styles.title, { fontSize: 12 * scale, flex: 1 }]}
                numberOfLines={1}
              >
                {t.title}
              </Text>
              <Text
                style={[
                  styles.dueChip,
                  {
                    fontSize: 11 * scale,
                    color: overdue
                      ? theme.colors.error
                      : status === 'dueToday'
                        ? theme.colors.blue
                        : theme.colors.label3,
                  },
                ]}
              >
                {formatDueIn(getNextDueDate(t))}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  shell: {
    backgroundColor: theme.colors.surfaceElevated,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  brand: {
    fontWeight: '700',
    color: theme.colors.blue,
    letterSpacing: -0.2,
  },
  big: {
    fontWeight: '700',
    color: theme.colors.text,
    lineHeight: 22,
  },
  counter: {
    color: theme.colors.label3,
    fontWeight: '500',
  },
  smallBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 'auto',
  },
  smallText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontWeight: '600',
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
  due: {
    fontWeight: '500',
    marginTop: 1,
  },
  allClear: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediumBody: {
    flex: 1,
    justifyContent: 'space-around',
    gap: 4,
  },
  mediumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  dueChip: {
    fontWeight: '600',
    minWidth: 44,
    textAlign: 'right',
  },
}));
