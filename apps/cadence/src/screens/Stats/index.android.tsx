import { useObserve } from 'expo-observe';
import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import Chip from '../../components/ui/android/Chip';
import MaterialCard from '../../components/ui/android/MaterialCard';
import TopAppBar from '../../components/ui/android/TopAppBar';
import OnTimeSummary from './OnTimeSummary';
import TaskLanes from './TaskLanes';
import { Range, useStats } from './useStats';

const RANGE_OPTIONS: { value: Range; label: string }[] = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
  { value: '365', label: '1 year' },
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
      <TopAppBar title="Stats" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.chipRow}>
          {RANGE_OPTIONS.map(opt => (
            <Chip
              key={opt.value}
              label={opt.label}
              selected={range === opt.value}
              onPress={() => setRange(opt.value)}
            />
          ))}
        </View>

        <MaterialCard>
          <OnTimeSummary stats={stats} />
        </MaterialCard>

        {stats.lanes.length > 0 && (
          <MaterialCard>
            <TaskLanes
              lanes={stats.lanes}
              start={start}
              end={end}
              rangeDays={rangeDays}
              ticks={ticks}
              onPressTask={openTask}
            />
          </MaterialCard>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 20,
  },
}));
