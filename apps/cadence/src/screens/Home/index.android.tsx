import { Dimensions, ScrollView, Text, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useState } from 'react';
import AllCaughtUp from '../../components/AllCaughtUp';
import EmptyStateStarters from '../../components/EmptyStateStarters';
import Chip from '../../components/ui/android/Chip';
import FAB from '../../components/ui/android/FAB';
import IconButton from '../../components/ui/IconButton';
import WidgetNudge from '../../components/WidgetNudge';
import { routes } from '../../lib/routes';
import { Task } from '../../lib/types';
import { isCompletedToday } from '../../utils/taskUtils';
import Section from './Section';
import { useHomeContent } from './useHomeContent';

type HomeFilter = 'all' | 'today' | 'overdue';

export default function Home({ tasks }: { tasks: Task[] }) {
  const { theme } = useUnistyles();
  const [filter, setFilter] = useState<HomeFilter>('all');
  const { router, confettiRef, buckets, dueTodayCount, expandedId, callbacks } =
    useHomeContent(tasks);

  const screenWidth = Dimensions.get('window').width;
  const emptyState = tasks.length === 0;

  const showOverdue =
    filter === 'all' || filter === 'today' || filter === 'overdue';
  const showToday = filter === 'all' || filter === 'today';
  const showLaterGroups = filter === 'all';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topBar}>
          <View style={{ flex: 1 }} />
          <IconButton
            symbol="chart.bar.fill"
            onPress={() => router.push(routes.stats)}
            accessibilityLabel="Stats"
          />
          <IconButton
            symbol="gearshape.fill"
            onPress={() => router.push(routes.settings)}
            accessibilityLabel="Settings"
          />
        </View>
        <Text style={styles.title}>Cadence</Text>
        <Text style={styles.subtitle}>
          {dueTodayCount === 0
            ? 'Nothing due today'
            : `${dueTodayCount} due today`}
        </Text>
        <View style={styles.chipRow}>
          <Chip
            label={`All · ${tasks.length}`}
            selected={filter === 'all'}
            onPress={() => setFilter('all')}
          />
          <Chip
            label={`Today · ${dueTodayCount}`}
            selected={filter === 'today'}
            onPress={() => setFilter('today')}
          />
          <Chip
            label={`Overdue · ${buckets.overdue.length}`}
            selected={filter === 'overdue'}
            error={buckets.overdue.length > 0}
            onPress={() => setFilter('overdue')}
          />
        </View>
      </View>

      {emptyState ? (
        <EmptyStateStarters />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {filter === 'all' && (
            <WidgetNudge onLearnMore={() => router.push(routes.onboarding)} />
          )}
          {buckets.overdue.length === 0 &&
            buckets.today.filter(t => !isCompletedToday(t)).length === 0 && (
              <AllCaughtUp />
            )}
          {showOverdue && (
            <Section
              label="Overdue"
              dotColor={theme.colors.error}
              items={buckets.overdue}
              expandedId={expandedId}
              callbacks={callbacks}
            />
          )}
          {showToday && (
            <Section
              label="Today"
              dotColor={theme.colors.blue}
              items={buckets.today}
              expandedId={expandedId}
              callbacks={callbacks}
            />
          )}
          {showLaterGroups && (
            <Section
              label="This week"
              dotColor={theme.colors.warning}
              items={buckets.thisWeek}
              expandedId={expandedId}
              callbacks={callbacks}
            />
          )}
          {showLaterGroups && (
            <Section
              label="Later"
              dotColor={theme.colors.label3}
              items={buckets.later}
              expandedId={expandedId}
              callbacks={callbacks}
            />
          )}
        </ScrollView>
      )}

      <FAB
        icon="plus"
        label="New task"
        extended
        onPress={() => router.push(routes.newTask)}
        accessibilityLabel="New task"
      />

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
    paddingBottom: 12,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 8,
  },
  title: {
    paddingHorizontal: 20,
    paddingTop: 4,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '400',
    color: theme.colors.text,
    letterSpacing: 0,
  },
  subtitle: {
    paddingHorizontal: 20,
    paddingTop: 2,
    paddingBottom: 12,
    fontSize: 14,
    color: theme.colors.label2,
    letterSpacing: 0.25,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
  },
  scroll: {
    paddingBottom: 40,
  },
}));
