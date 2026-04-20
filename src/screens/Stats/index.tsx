import { SymbolView } from 'expo-symbols';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import BigStatTile from '../../components/BigStatTile';
import Heatmap from '../../components/Heatmap';
import SectionCard from '../../components/SectionCard';
import SegmentedControl from '../../components/ui/SegmentedControl';
import TaskTile from '../../components/ui/TaskTile';
import WeeklyChart from '../../components/WeeklyChart';
import { Task, taskStorage } from '../../lib/storage';
import {
  computeHeatmap,
  computeOnTimePct,
  computeWeeklyCompletions,
  taskHealth,
} from '../../utils/statsUtils';
import { formatDueIn, getNextDueDate } from '../../utils/taskUtils';

type Range = '7' | '30' | '90' | '365';

export default function StatsScreen() {
  const router = useRouter();
  const { theme, rt } = useUnistyles();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [range, setRange] = useState<Range>('30');
  const rangeDays = parseInt(range);

  const load = useCallback(async () => {
    const all = await taskStorage.getAllTasks();
    setTasks(all);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const overall = useMemo(() => {
    const { onTime, late, pct } = computeOnTimePct(tasks, rangeDays);
    const cutoff = Date.now() - rangeDays * 86400000;
    let completions = 0;
    for (const t of tasks) {
      for (const d of t.completedDates ?? []) {
        if (d >= cutoff) completions++;
      }
    }
    return { onTime, late, pct, completions };
  }, [tasks, rangeDays]);

  const weekly = useMemo(() => computeWeeklyCompletions(tasks, 12), [tasks]);
  const heatmap = useMemo(
    () => computeHeatmap(tasks, rangeDays),
    [tasks, rangeDays]
  );

  const hallOfShame = useMemo(() => {
    return [...tasks]
      .map(t => ({ t, h: taskHealth(t) }))
      .filter(x => x.h > 1)
      .sort((a, b) => b.h - a.h)
      .slice(0, 4);
  }, [tasks]);

  return (
    <View style={[styles.root, { paddingTop: rt.insets.top }]}>
      <View style={styles.nav}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <SymbolView
            name="chevron.left"
            size={18}
            tintColor={theme.colors.blue}
            resizeMode="scaleAspectFit"
            fallback={null}
          />
          <Text style={styles.backText}>Tasks</Text>
        </Pressable>
      </View>
      <Text style={styles.title}>Stats</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.rangeWrap}>
          <SegmentedControl
            value={range}
            onChange={setRange}
            options={[
              { value: '7', label: '7d' },
              { value: '30', label: '30d' },
              { value: '90', label: '90d' },
              { value: '365', label: '1y' },
            ]}
          />
        </View>

        <View style={styles.tiles}>
          <BigStatTile
            label="On-time"
            value={`${overall.pct}%`}
            sub={`${overall.onTime} on time · ${overall.late} late`}
            accent={theme.colors.success}
          />
          <BigStatTile
            label="Completions"
            value={overall.completions}
            sub={`over ${rangeDays} days`}
            accent={theme.colors.blue}
          />
        </View>

        <SectionCard title="Weekly completions">
          <WeeklyChart weekly={weekly} />
        </SectionCard>

        <SectionCard
          title="When you actually get it done"
          subtitle="Day × time completions"
        >
          <Heatmap data={heatmap} />
        </SectionCard>

        {hallOfShame.length > 0 && (
          <SectionCard title="Most overdue" flush>
            {hallOfShame.map((x, i) => (
              <Pressable
                key={x.t.id}
                style={[
                  styles.overdueRow,
                  i > 0 && {
                    borderTopWidth: 0.5,
                    borderTopColor: theme.colors.sepSubtle,
                  },
                ]}
                onPress={() => router.push(`/task/${x.t.id}`)}
              >
                <TaskTile task={x.t} size={34} overdue />
                <View style={styles.overdueBody}>
                  <Text style={styles.overdueTitle}>{x.t.title}</Text>
                  <Text style={styles.overdueSub}>
                    {formatDueIn(getNextDueDate(x.t))}
                  </Text>
                </View>
                <SymbolView
                  name="chevron.right"
                  size={14}
                  tintColor={theme.colors.label4}
                  resizeMode="scaleAspectFit"
                  fallback={null}
                />
              </Pressable>
            ))}
          </SectionCard>
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
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    padding: 4,
  },
  backText: {
    color: theme.colors.blue,
    fontSize: 17,
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
    marginBottom: 14,
  },
  tiles: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 14,
  },
  overdueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  overdueBody: {
    flex: 1,
    minWidth: 0,
  },
  overdueTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
  overdueSub: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: 2,
    fontWeight: '500',
  },
}));
