import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Alert, Dimensions, ScrollView, Text, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import AllCaughtUp from '../../components/AllCaughtUp';
import EmptyStateStarters from '../../components/EmptyStateStarters';
import TaskRow from '../../components/TaskRow';
import IconButton from '../../components/ui/IconButton';
import WidgetNudge from '../../components/WidgetNudge';
import { WidgetProvider } from '../../contexts/WidgetContext';
import { Task } from '../../lib/types';
import { useTasksStore } from '../../stores/tasks';
import {
  getNextDueDate,
  getTodayTimestamp,
  isCompletedToday,
  isDueToday,
  isOverdue,
  normalizeToMidnight,
  sortTasksByDueDate,
} from '../../utils/taskUtils';

const MS_DAY = 86400000;

function formatTodayHeading(date = new Date()): string {
  return date.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

interface Buckets {
  overdue: Task[];
  today: Task[];
  thisWeek: Task[];
  later: Task[];
}

function bucketize(tasks: Task[]): Buckets {
  const now = getTodayTimestamp();
  const inWeek = now + 7 * MS_DAY;
  const buckets: Buckets = { overdue: [], today: [], thisWeek: [], later: [] };
  for (const t of tasks) {
    if (isCompletedToday(t)) {
      buckets.today.push(t);
      continue;
    }
    const due = getNextDueDate(t);
    if (due < now) buckets.overdue.push(t);
    else if (due === now) buckets.today.push(t);
    else if (due < inWeek) buckets.thisWeek.push(t);
    else buckets.later.push(t);
  }
  const sortFn = (a: Task, b: Task) => getNextDueDate(a) - getNextDueDate(b);
  (Object.keys(buckets) as (keyof Buckets)[]).forEach(k =>
    buckets[k].sort(sortFn)
  );
  return buckets;
}

function HomeContent({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const { theme } = useUnistyles();
  const confettiRef = useRef<ConfettiCannon>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const markCompleted = useTasksStore(s => s.markCompleted);
  const unmarkCompleted = useTasksStore(s => s.unmarkCompleted);
  const removeTaskFromStore = useTasksStore(s => s.remove);

  const buckets = useMemo(() => bucketize(tasks), [tasks]);
  const heading = useMemo(formatTodayHeading, []);

  const celebrateCompletion = () => {
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      confettiRef.current?.start();
    }, 200);
  };

  const markDone = async (task: Task) => {
    await markCompleted(task.id);
    const updated = useTasksStore.getState().tasks;
    const remaining = updated.filter(
      t => (isOverdue(t) || isDueToday(t)) && !isCompletedToday(t)
    );
    if (remaining.length === 0) celebrateCompletion();
  };

  const quickDone = async (task: Task) => {
    const today = getTodayTimestamp();
    if (isCompletedToday(task)) {
      const entry = task.completedDates?.find(
        d => normalizeToMidnight(d) === today
      );
      if (entry) await unmarkCompleted(task.id, entry);
      return;
    }
    const nextDue = normalizeToMidnight(getNextDueDate(task));
    const diffDays = Math.floor((nextDue - today) / MS_DAY);
    if (diffDays > 0) {
      Alert.alert(
        'Confirm completion',
        `This task isn't due for another ${diffDays} day${diffDays === 1 ? '' : 's'}. Mark it done anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Mark as done', onPress: () => markDone(task) },
        ]
      );
    } else {
      await markDone(task);
    }
  };

  const deleteTask = (task: Task) => {
    Alert.alert(
      'Delete task',
      `"${task.title}" and its history will be removed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeTaskFromStore(task.id),
        },
      ]
    );
  };

  const pickDate = (task: Task) => {
    router.push(`/task/${task.id}`);
  };

  const toggleExpanded = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const renderSection = (
    label: string,
    dotColor: string,
    items: Task[],
    key: keyof Buckets
  ) => {
    if (items.length === 0) return null;
    return (
      <View key={key} style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <Text style={styles.sectionLabel}>{label}</Text>
          <Text style={styles.sectionCount}>{items.length}</Text>
        </View>
        <View style={styles.sectionCard}>
          {items.map((task, i) => (
            <View key={task.id}>
              <TaskRow
                task={task}
                isExpanded={expandedId === task.id}
                onTap={() => toggleExpanded(task.id)}
                actions={{
                  toggleComplete: () => quickDone(task),
                  quickDone: () => quickDone(task),
                  edit: () => router.push(`/new?taskId=${task.id}`),
                  delete: () => deleteTask(task),
                  openHistory: () => router.push(`/task/${task.id}`),
                  pickDate: () => pickDate(task),
                }}
              />
              {i < items.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const screenWidth = Dimensions.get('window').width;
  const emptyState = tasks.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Tasks</Text>
          <View style={styles.headerButtons}>
            <IconButton
              symbol="chart.bar.fill"
              onPress={() => router.push('/stats')}
              accessibilityLabel="Stats"
            />
            <IconButton
              symbol="gearshape.fill"
              onPress={() => router.push('/settings')}
              accessibilityLabel="Settings"
            />
            <IconButton
              symbol="plus"
              filled
              onPress={() => router.push('/new')}
              accessibilityLabel="New task"
            />
          </View>
        </View>
        <Text style={styles.subtitle}>{heading}</Text>
      </View>

      {emptyState ? (
        <EmptyStateStarters />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <WidgetNudge onLearnMore={() => router.push('/onboarding')} />
          {buckets.overdue.length === 0 &&
            buckets.today.filter(t => !isCompletedToday(t)).length === 0 && (
              <AllCaughtUp />
            )}
          {renderSection(
            'Overdue',
            theme.colors.error,
            buckets.overdue,
            'overdue'
          )}
          {renderSection('Today', theme.colors.blue, buckets.today, 'today')}
          {renderSection(
            'This week',
            theme.colors.warning,
            buckets.thisWeek,
            'thisWeek'
          )}
          {renderSection('Later', theme.colors.label3, buckets.later, 'later')}
        </ScrollView>
      )}

      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: screenWidth / 2, y: -20 }}
        fadeOut
        autoStart={false}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
    paddingTop: rt.insets.top,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 0.37,
    lineHeight: 41,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.label3,
    marginTop: 4,
  },
  scroll: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.label2,
    textTransform: 'uppercase',
    letterSpacing: -0.1,
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.label3,
  },
  sectionCard: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 16,
    overflow: 'hidden',
  },
  separator: {
    height: 0.5,
    backgroundColor: theme.colors.sepSubtle,
    marginLeft: 68,
  },
}));

export default function Home() {
  const tasks = useTasksStore(s => s.tasks);
  const sortedTasks = useMemo(() => sortTasksByDueDate(tasks), [tasks]);

  return (
    <WidgetProvider tasks={sortedTasks}>
      <HomeContent tasks={sortedTasks} />
    </WidgetProvider>
  );
}
