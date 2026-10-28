import { useObserve } from 'expo-observe';
import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import GlassBackButton from '../../components/ui/GlassBackButton';
import SegmentedControl from '../../components/ui/SegmentedControl';
import OnTimeSummary from './OnTimeSummary';
import TaskLanes from './TaskLanes';
import { Range, useStats } from './useStats';

const RANGE_OPTIONS: { value: Range; label: string }[] = [
  { value: '7', label: '7d' },
  { value: '30', label: '30d' },
  { value: '90', label: '90d' },
  { value: '365', label: '1y' },
];

export default function StatsScreen() {
  const { rt } = useUnistyles();
  const {
    router,
    range,
    setRange,
    rangeDays,
    start,
    end,
    stats,
    ticks,
    openTask,
  } = useStats();

  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  return (
    <View style={[styles.root, { paddingTop: rt.insets.top }]}>
      <View style={styles.nav}>
        <GlassBackButton label="Tasks" onPress={() => router.back()} />
      </View>
      <Text style={styles.title}>Stats</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.rangeWrap}>
          <SegmentedControl
            value={range}
            onChange={setRange}
            options={RANGE_OPTIONS}
          />
        </View>

        <View style={styles.summary}>
          <OnTimeSummary stats={stats} />
        </View>

        {stats.lanes.length > 0 && (
          <View style={styles.card}>
            <TaskLanes
              lanes={stats.lanes}
              start={start}
              end={end}
              rangeDays={rangeDays}
              ticks={ticks}
              onPressTask={openTask}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
    paddingLeft: rt.insets.left,
    paddingRight: rt.insets.right,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 0.37,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },
  scroll: {
    paddingBottom: 40,
  },
  rangeWrap: {
    marginHorizontal: 16,
  },
  summary: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
  },
  card: {
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceElevated,
  },
}));
