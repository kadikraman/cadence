import { useMemo } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import AllCaughtUp from '../../components/AllCaughtUp';
import EmptyStateStarters from '../../components/EmptyStateStarters';
import IconButton from '../../components/ui/IconButton';
import WidgetNudge from '../../components/WidgetNudge';
import { routes } from '../../lib/routes';
import { Task } from '../../lib/types';
import { isCompletedToday } from '../../utils/taskUtils';
import Section from './Section';
import { formatTodayHeading, useHomeContent } from './useHomeContent';

export default function Home({ tasks }: { tasks: Task[] }) {
  const { theme } = useUnistyles();
  const { router, confettiRef, buckets, expandedId, callbacks } =
    useHomeContent(tasks);

  const heading = useMemo(formatTodayHeading, []);
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
              onPress={() => router.push(routes.stats)}
              accessibilityLabel="Stats"
            />
            <IconButton
              symbol="gearshape.fill"
              onPress={() => router.push(routes.settings)}
              accessibilityLabel="Settings"
            />
            <IconButton
              symbol="plus"
              filled
              onPress={() => router.push(routes.newTask)}
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
          <WidgetNudge onLearnMore={() => router.push(routes.onboarding)} />
          {buckets.overdue.length === 0 &&
            buckets.today.filter(t => !isCompletedToday(t)).length === 0 && (
              <AllCaughtUp />
            )}
          <Section
            label="Overdue"
            dotColor={theme.colors.error}
            items={buckets.overdue}
            expandedId={expandedId}
            callbacks={callbacks}
          />
          <Section
            label="Today"
            dotColor={theme.colors.blue}
            items={buckets.today}
            expandedId={expandedId}
            callbacks={callbacks}
          />
          <Section
            label="This week"
            dotColor={theme.colors.warning}
            items={buckets.thisWeek}
            expandedId={expandedId}
            callbacks={callbacks}
          />
          <Section
            label="Later"
            dotColor={theme.colors.label3}
            items={buckets.later}
            expandedId={expandedId}
            callbacks={callbacks}
          />
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
}));
