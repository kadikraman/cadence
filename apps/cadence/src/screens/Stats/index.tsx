import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BigStatTile from '../../components/BigStatTile';
import CadenceMixBar from '../../components/CadenceMixBar';
import DowChart from '../../components/DowChart';
import SectionCard from '../../components/SectionCard';
import Chip from '../../components/ui/android/Chip';
import MaterialCard from '../../components/ui/android/MaterialCard';
import TopAppBar from '../../components/ui/android/TopAppBar';
import SegmentedControl from '../../components/ui/SegmentedControl';
import TaskTile from '../../components/ui/TaskTile';
import WeeklyChart from '../../components/WeeklyChart';
import { useTasksStore } from '../../stores/tasks';
import {
  computeAvgLateDrift,
  computeCadenceMix,
  computeDowCounts,
  computeLongestStreak,
  computeMostReliable,
  computeOnTimePct,
  computeWeeklyCompletions,
  taskHealth,
} from '../../utils/statsUtils';
import { formatDueIn, getNextDueDate } from '../../utils/taskUtils';

type Range = '7' | '30' | '90' | '365';

const IS_ANDROID = Platform.OS === 'android';

const RANGE_OPTIONS_IOS: { value: Range; label: string }[] = [
  { value: '7', label: '7d' },
  { value: '30', label: '30d' },
  { value: '90', label: '90d' },
  { value: '365', label: '1y' },
];

const RANGE_OPTIONS_ANDROID: { value: Range; label: string }[] = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
  { value: '365', label: '1 year' },
];

export default function StatsScreen() {
  const router = useRouter();
  const { theme, rt } = useUnistyles();
  const tasks = useTasksStore(s => s.tasks);
  const [range, setRange] = useState<Range>('30');
  const rangeDays = parseInt(range);

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
  const longestStreak = useMemo(() => computeLongestStreak(tasks), [tasks]);
  const avgLateDrift = useMemo(
    () => computeAvgLateDrift(tasks, rangeDays),
    [tasks, rangeDays]
  );
  const mostReliable = useMemo(
    () => computeMostReliable(tasks, rangeDays),
    [tasks, rangeDays]
  );
  const dowCounts = useMemo(
    () => computeDowCounts(tasks, rangeDays),
    [tasks, rangeDays]
  );
  const cadenceMix = useMemo(() => computeCadenceMix(tasks), [tasks]);

  const hallOfShame = useMemo(() => {
    return [...tasks]
      .map(t => ({ t, h: taskHealth(t) }))
      .filter(x => x.h > 1)
      .sort((a, b) => b.h - a.h)
      .slice(0, 4);
  }, [tasks]);

  if (IS_ANDROID) {
    return (
      <View style={[styles.root, { paddingTop: rt.insets.top }]}>
        <TopAppBar title="Stats" onBack={() => router.back()} />
        <ScrollView contentContainerStyle={styles.androidScroll}>
          <View style={styles.androidChipRow}>
            {RANGE_OPTIONS_ANDROID.map(opt => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={range === opt.value}
                onPress={() => setRange(opt.value)}
              />
            ))}
          </View>

          <View
            style={[
              styles.androidHeadline,
              {
                backgroundColor: theme.colors.primaryContainer,
              },
            ]}
          >
            <Text
              style={[
                styles.androidHeadlineLabel,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              On-time rate
            </Text>
            <Text
              style={[
                styles.androidHeadlineValue,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              {overall.pct}%
            </Text>
            <Text
              style={[
                styles.androidHeadlineSub,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              {overall.onTime} on time · {overall.late} late ·{' '}
              {overall.completions} completion
              {overall.completions === 1 ? '' : 's'}
            </Text>
          </View>

          <MaterialCard title="Weekly completions">
            <WeeklyChart weekly={weekly} />
          </MaterialCard>

          <MaterialCard title="Busiest day of week">
            <DowChart counts={dowCounts} />
          </MaterialCard>

          {cadenceMix.total > 0 && (
            <MaterialCard title="Cadence mix">
              <CadenceMixBar mix={cadenceMix} />
            </MaterialCard>
          )}

          {longestStreak.task && (
            <MaterialCard title="Longest streak">
              <View style={styles.androidStatLine}>
                <Text
                  style={[
                    styles.androidStatValue,
                    { color: theme.colors.text },
                  ]}
                >
                  {longestStreak.streak}
                </Text>
                <Text
                  style={[
                    styles.androidStatSub,
                    { color: theme.colors.label2 },
                  ]}
                >
                  {longestStreak.task.title}
                </Text>
              </View>
            </MaterialCard>
          )}

          {mostReliable.task && (
            <MaterialCard title="Most reliable" flush>
              <Pressable
                onPress={() => router.push(`/task/${mostReliable.task!.id}`)}
                android_ripple={{
                  color: theme.colors.fill2,
                  borderless: false,
                }}
                style={styles.androidTaskLinkRow}
              >
                <TaskTile task={mostReliable.task} size={36} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    style={[
                      styles.androidLinkTitle,
                      { color: theme.colors.text },
                    ]}
                  >
                    {mostReliable.task.title}
                  </Text>
                  <Text
                    style={[
                      styles.androidLinkSub,
                      { color: theme.colors.success },
                    ]}
                  >
                    {mostReliable.pct}% on time · {mostReliable.completions}{' '}
                    completion
                    {mostReliable.completions === 1 ? '' : 's'}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={theme.colors.label3}
                />
              </Pressable>
            </MaterialCard>
          )}

          {hallOfShame.length > 0 && (
            <MaterialCard title="Most overdue" flush>
              {hallOfShame.map((x, i) => (
                <Pressable
                  key={x.t.id}
                  onPress={() => router.push(`/task/${x.t.id}`)}
                  android_ripple={{
                    color: theme.colors.fill2,
                    borderless: false,
                  }}
                  style={[
                    styles.androidTaskLinkRow,
                    i > 0 && {
                      borderTopWidth: 1,
                      borderTopColor: theme.colors.outlineVariant,
                    },
                  ]}
                >
                  <TaskTile task={x.t} size={36} overdue />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      style={[
                        styles.androidLinkTitle,
                        { color: theme.colors.text },
                      ]}
                    >
                      {x.t.title}
                    </Text>
                    <Text
                      style={[
                        styles.androidLinkSub,
                        { color: theme.colors.error },
                      ]}
                    >
                      {formatDueIn(getNextDueDate(x.t))}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={theme.colors.label3}
                  />
                </Pressable>
              ))}
            </MaterialCard>
          )}

          {avgLateDrift > 0 && (
            <MaterialCard title="Average drift when late">
              <View style={styles.androidStatLine}>
                <Text
                  style={[
                    styles.androidStatValue,
                    { color: theme.colors.error },
                  ]}
                >
                  {avgLateDrift.toFixed(1)}d
                </Text>
              </View>
            </MaterialCard>
          )}
        </ScrollView>
      </View>
    );
  }

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
            options={RANGE_OPTIONS_IOS}
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

        <View style={styles.tiles}>
          <BigStatTile
            label="Longest streak"
            value={longestStreak.streak}
            sub={
              longestStreak.task ? longestStreak.task.title : 'No active streak'
            }
            accent={theme.colors.warning}
          />
          <BigStatTile
            label="Avg drift"
            value={avgLateDrift > 0 ? `${avgLateDrift.toFixed(1)}d` : '—'}
            sub={avgLateDrift > 0 ? 'when late' : 'No late completions'}
            accent={
              avgLateDrift > 0 ? theme.colors.error : theme.colors.success
            }
          />
        </View>

        <SectionCard title="Weekly completions">
          <WeeklyChart weekly={weekly} />
        </SectionCard>

        <SectionCard title="Busiest day of week">
          <DowChart counts={dowCounts} />
        </SectionCard>

        {cadenceMix.total > 0 && (
          <SectionCard title="Cadence mix">
            <CadenceMixBar mix={cadenceMix} />
          </SectionCard>
        )}

        {mostReliable.task && (
          <SectionCard title="Most reliable" flush>
            <Pressable
              style={styles.overdueRow}
              onPress={() => router.push(`/task/${mostReliable.task!.id}`)}
            >
              <TaskTile task={mostReliable.task} size={34} />
              <View style={styles.overdueBody}>
                <Text style={styles.overdueTitle}>
                  {mostReliable.task.title}
                </Text>
                <Text
                  style={[styles.reliableSub, { color: theme.colors.success }]}
                >
                  {mostReliable.pct}% on time · {mostReliable.completions}{' '}
                  completions
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
          </SectionCard>
        )}

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
  reliableSub: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  androidScroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  androidChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 20,
  },
  androidHeadline: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 12,
  },
  androidHeadlineLabel: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  androidHeadlineValue: {
    fontSize: 56,
    fontWeight: '300',
    lineHeight: 56,
    letterSpacing: -1,
    marginTop: 8,
  },
  androidHeadlineSub: {
    fontSize: 14,
    marginTop: 6,
    opacity: 0.8,
  },
  androidStatLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  androidStatValue: {
    fontSize: 28,
    fontWeight: '400',
  },
  androidStatSub: {
    fontSize: 14,
    flex: 1,
  },
  androidTaskLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  androidLinkTitle: {
    fontSize: 15,
  },
  androidLinkSub: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
}));
