import { SegmentedControl } from '@expo/ui/community/segmented-control';
import { useObserve } from 'expo-observe';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import AllCaughtUp from '../../components/AllCaughtUp';
import CompletionSheet from '../../components/CompletionSheet';
import CompletionToast from '../../components/CompletionToast';
import EmptyStateStarters from '../../components/EmptyStateStarters';
import WidgetNudge from '../../components/WidgetNudge';
import { routes } from '../../lib/routes';
import { Task } from '../../lib/types';
import { HomeTab } from '../../stores/settings';
import { isCompletedToday } from '../../utils/taskUtils';
import Section from './Section';
import TodoList from './TodoList';
import { useHomeContent } from './useHomeContent';
import { useHomeTab } from './useHomeTab';

const TABS: HomeTab[] = ['tasks', 'todo'];
const TAB_LABELS = ['Tasks', 'To do'];

export default function Home({ tasks }: { tasks: Task[] }) {
  const { theme } = useUnistyles();
  const {
    router,
    confettiRef,
    today,
    buckets,
    expandedId,
    callbacks,
    heading,
    completionSheet,
    completionToast,
  } = useHomeContent(tasks);
  const { todosEnabled, tab, setTab, todoInputRef } = useHomeTab();

  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  const screenWidth = Dimensions.get('window').width;
  const emptyState = tasks.length === 0;

  const header = (
    <View style={styles.header}>
      <Text style={styles.subtitle}>{heading}</Text>
      {todosEnabled && (
        <View style={styles.tabs}>
          <SegmentedControl
            values={TAB_LABELS}
            selectedIndex={TABS.indexOf(tab)}
            onChange={e => setTab(TABS[e.nativeEvent.selectedSegmentIndex])}
          />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Title large>{tab === 'todo' ? 'To do' : 'Tasks'}</Stack.Title>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="chart.bar.fill"
          onPress={() => router.push(routes.stats)}
          accessibilityLabel="Stats"
        />
        <Stack.Toolbar.Button
          icon="gearshape.fill"
          onPress={() => router.push(routes.settings)}
          accessibilityLabel="Settings"
        />
        <Stack.Toolbar.Button
          icon="plus"
          variant="prominent"
          separateBackground
          onPress={() =>
            tab === 'todo'
              ? todoInputRef.current?.focus()
              : router.push(routes.newTask)
          }
          accessibilityLabel={tab === 'todo' ? 'New to-do' : 'New task'}
        />
      </Stack.Toolbar>
      {tab === 'todo' ? (
        <TodoList inputRef={todoInputRef} header={header} />
      ) : emptyState ? (
        <EmptyStateStarters header={header} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          contentInsetAdjustmentBehavior="automatic"
        >
          {header}
          <WidgetNudge onLearnMore={() => router.push(routes.onboarding)} />
          {buckets.overdue.length === 0 &&
            buckets.today.filter(t => !isCompletedToday(t, today)).length ===
              0 && <AllCaughtUp />}
          <Section
            label="Overdue"
            dotColor={theme.colors.error}
            items={buckets.overdue}
            today={today}
            expandedId={expandedId}
            callbacks={callbacks}
          />
          <Section
            label="Today"
            dotColor={theme.colors.blue}
            items={buckets.today}
            today={today}
            expandedId={expandedId}
            callbacks={callbacks}
          />
          <Section
            label="This week"
            dotColor={theme.colors.warning}
            items={buckets.thisWeek}
            today={today}
            expandedId={expandedId}
            callbacks={callbacks}
          />
          <Section
            label="Later"
            dotColor={theme.colors.label3}
            items={buckets.later}
            today={today}
            expandedId={expandedId}
            callbacks={callbacks}
          />
        </ScrollView>
      )}

      <CompletionToast {...completionToast} />
      <CompletionSheet {...completionSheet} />

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
    paddingLeft: rt.insets.left,
    paddingRight: rt.insets.right,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.label3,
  },
  tabs: {
    marginTop: 14,
  },
  scroll: {
    paddingBottom: 40,
  },
}));
