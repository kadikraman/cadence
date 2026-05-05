import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import {
  formatDueIn,
  getNextDueDate,
  getTaskStatus,
  isDueToday,
  isOverdue,
} from '../../utils/taskUtils';
import TaskTile from '../ui/TaskTile';
import {
  WidgetPreviewProps,
  buildSummaryLabel,
  computePreviewData,
} from './helpers';

export type { WidgetPreviewProps } from './helpers';

export default function WidgetPreview({
  size,
  tasks,
  scale = 1,
}: WidgetPreviewProps) {
  const { theme } = useUnistyles();
  const { sorted, urgent, upcoming, overdueCount, todayCount } =
    computePreviewData(tasks);

  const headerTone =
    overdueCount > 0
      ? theme.colors.error
      : todayCount > 0
        ? theme.colors.blue
        : theme.colors.label3;

  if (size === 'small') {
    const primary = urgent[0] ?? upcoming[0];
    const next = urgent[0] ? upcoming[0] : upcoming[1];
    const primaryOverdue = primary ? isOverdue(primary) : false;
    const primaryToday = primary ? isDueToday(primary) : false;
    const labelText = primaryOverdue
      ? formatDueIn(getNextDueDate(primary)).toUpperCase()
      : 'TODAY';
    const labelColor = primaryOverdue ? theme.colors.error : theme.colors.blue;
    const count = urgent.length;

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
          <Text
            style={[styles.big, { fontSize: 20 * scale, color: headerTone }]}
          >
            {count}
          </Text>
        </View>

        {primary && (primaryOverdue || primaryToday) && (
          <View style={[styles.smallHero, { marginTop: 8 * scale }]}>
            <TaskTile
              task={primary}
              size={34 * scale}
              overdue={primaryOverdue}
            />
            <View style={styles.smallText}>
              <Text
                style={[
                  styles.heroLabel,
                  { fontSize: 9 * scale, color: labelColor },
                ]}
              >
                {labelText}
              </Text>
              <Text
                style={[styles.heroTitle, { fontSize: 14 * scale }]}
                numberOfLines={2}
              >
                {primary.title}
              </Text>
            </View>
          </View>
        )}

        {next && (
          <View style={[styles.smallNext, { marginTop: 'auto' }]}>
            <TaskTile task={next} size={18 * scale} overdue={false} />
            <Text
              style={[styles.nextTitle, { fontSize: 11 * scale }]}
              numberOfLines={1}
            >
              {next.title}
            </Text>
            <Text style={[styles.nextDue, { fontSize: 10 * scale }]}>
              {formatDueIn(getNextDueDate(next))}
            </Text>
          </View>
        )}
      </View>
    );
  }

  const rows = sorted.slice(0, 3);
  const mediumLabel = buildSummaryLabel(
    sorted.length,
    overdueCount,
    todayCount
  );

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
        <Text
          style={[styles.counter, { fontSize: 12 * scale, color: headerTone }]}
        >
          {mediumLabel}
        </Text>
      </View>
      <View style={styles.mediumBody}>
        {rows.map(t => {
          const status = getTaskStatus(t);
          const overdue = status === 'overdue';
          const dueToday = status === 'dueToday';
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
                      : dueToday
                        ? theme.colors.blue
                        : theme.colors.label3,
                  },
                ]}
              >
                {dueToday ? 'TODAY' : formatDueIn(getNextDueDate(t))}
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
    marginBottom: 4,
  },
  brand: {
    fontWeight: '700',
    color: theme.colors.blue,
    letterSpacing: -0.2,
  },
  big: {
    fontWeight: '700',
    lineHeight: 22,
  },
  counter: {
    fontWeight: '600',
  },
  smallHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  smallText: {
    flex: 1,
    minWidth: 0,
  },
  heroLabel: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: -0.2,
    marginTop: 2,
  },
  smallNext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextTitle: {
    flex: 1,
    fontWeight: '500',
    color: theme.colors.label2,
  },
  nextDue: {
    fontWeight: '600',
    color: theme.colors.label3,
  },
  title: {
    fontWeight: '600',
    color: theme.colors.text,
    letterSpacing: -0.2,
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
    fontWeight: '700',
    minWidth: 44,
    textAlign: 'right',
  },
}));
