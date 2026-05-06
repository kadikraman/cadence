import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Task } from '../../lib/types';
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
    const urgentN = urgent.length;
    const heroOnly = urgentN === 1 && upcoming.length === 0;
    const overflow = urgentN > 2 ? urgentN - 2 : 0;
    const listRows: Task[] =
      urgentN > 2 ? urgent.slice(0, 2) : [...urgent, ...upcoming].slice(0, 3);

    const count = urgentN;
    const countColor =
      overdueCount > 0 || urgentN >= 5 ? theme.colors.error : theme.colors.blue;

    return (
      <View
        style={[
          styles.shell,
          {
            width: 170 * scale,
            height: 170 * scale,
            borderRadius: 22 * scale,
            padding: 14 * scale,
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.brand, { fontSize: 13 * scale }]}>Cadence</Text>
          <Text
            style={[styles.big, { fontSize: 14 * scale, color: countColor }]}
          >
            {count}
          </Text>
        </View>

        {heroOnly && (
          <View style={styles.smallHeroWrap}>
            <View style={[styles.smallHeroStack, { gap: 10 * scale }]}>
              <TaskTile
                task={urgent[0]}
                size={42 * scale}
                overdue={isOverdue(urgent[0])}
              />
              <View>
                <Text
                  style={[
                    styles.heroLabel,
                    {
                      fontSize: 10 * scale,
                      color: isOverdue(urgent[0])
                        ? theme.colors.error
                        : theme.colors.blue,
                    },
                  ]}
                >
                  {isOverdue(urgent[0])
                    ? formatDueIn(getNextDueDate(urgent[0])).toUpperCase()
                    : 'TODAY'}
                </Text>
                <Text
                  style={[
                    styles.heroTitle,
                    { fontSize: 17 * scale, lineHeight: 19 * scale },
                  ]}
                  numberOfLines={2}
                >
                  {urgent[0].title}
                </Text>
              </View>
            </View>
          </View>
        )}

        {!heroOnly && listRows.length > 0 && (
          <View style={[styles.smallList, { marginTop: 4 * scale }]}>
            {listRows.map((t, i) => {
              const overdue = isOverdue(t);
              const dueToday = !overdue && isDueToday(t);
              return (
                <View key={t.id}>
                  {i > 0 && (
                    <View
                      style={[
                        styles.smallDivider,
                        { marginVertical: 3 * scale },
                      ]}
                    />
                  )}
                  <View style={styles.smallRow}>
                    <TaskTile task={t} size={24 * scale} overdue={overdue} />
                    <View
                      style={[styles.smallRowText, { marginLeft: 8 * scale }]}
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.smallRowTitle,
                          {
                            fontSize: 12 * scale,
                            lineHeight: 13 * scale,
                          },
                        ]}
                      >
                        {t.title}
                      </Text>
                      <Text
                        style={[
                          styles.smallRowDue,
                          {
                            fontSize: 10 * scale,
                            lineHeight: 11 * scale,
                            color: overdue
                              ? theme.colors.error
                              : dueToday
                                ? theme.colors.blue
                                : theme.colors.label3,
                          },
                        ]}
                      >
                        {formatDueIn(getNextDueDate(t))}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
            {overflow > 0 && (
              <>
                <View
                  style={[styles.smallDivider, { marginVertical: 3 * scale }]}
                />
                <View style={styles.smallRow}>
                  <View
                    style={{
                      width: 24 * scale,
                      height: 24 * scale,
                      borderRadius: 7 * scale,
                      backgroundColor: theme.colors.blue + '24',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12 * scale,
                        fontWeight: '700',
                        color: theme.colors.blue,
                      }}
                    >
                      …
                    </Text>
                  </View>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.smallRowTitle,
                      {
                        fontSize: 12 * scale,
                        lineHeight: 13 * scale,
                        color: theme.colors.blue,
                        marginLeft: 8 * scale,
                      },
                    ]}
                  >
                    +{overflow} more today
                  </Text>
                </View>
              </>
            )}
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
          width: 360 * scale,
          height: 170 * scale,
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
  smallHeroWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  smallHeroStack: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  heroLabel: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: -0.4,
    marginTop: 3,
  },
  smallList: {
    flexShrink: 1,
  },
  smallRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallRowText: {
    flex: 1,
    minWidth: 0,
  },
  smallRowTitle: {
    fontWeight: '600',
    color: theme.colors.text,
    letterSpacing: -0.15,
  },
  smallRowDue: {
    fontWeight: '500',
  },
  smallDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
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
