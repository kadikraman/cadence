import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import BigStatTile from '../../components/BigStatTile';
import CadenceMixBar from '../../components/CadenceMixBar';
import DowChart from '../../components/DowChart';
import SectionCard from '../../components/SectionCard';
import SegmentedControl from '../../components/ui/SegmentedControl';
import TaskTile from '../../components/ui/TaskTile';
import WeeklyChart from '../../components/WeeklyChart';
import { routes } from '../../lib/routes';
import { formatDueIn, getNextDueDate } from '../../utils/taskUtils';
import { Range, useStats } from './useStats';

const RANGE_OPTIONS: { value: Range; label: string }[] = [
  { value: '7', label: '7d' },
  { value: '30', label: '30d' },
  { value: '90', label: '90d' },
  { value: '365', label: '1y' },
];

export default function StatsScreen() {
  const router = useRouter();
  const { theme, rt } = useUnistyles();
  const {
    range,
    setRange,
    rangeDays,
    overall,
    weekly,
    longestStreak,
    avgLateDrift,
    mostReliable,
    dowCounts,
    cadenceMix,
    hallOfShame,
  } = useStats();

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
            options={RANGE_OPTIONS}
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
              onPress={() =>
                router.push(routes.taskDetail(mostReliable.task!.id))
              }
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
                onPress={() => router.push(routes.taskDetail(x.t.id))}
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
}));
