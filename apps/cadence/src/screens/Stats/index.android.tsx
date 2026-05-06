import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CadenceMixBar from '../../components/CadenceMixBar';
import DowChart from '../../components/DowChart';
import Chip from '../../components/ui/android/Chip';
import MaterialCard from '../../components/ui/android/MaterialCard';
import TopAppBar from '../../components/ui/android/TopAppBar';
import TaskTile from '../../components/ui/TaskTile';
import WeeklyChart from '../../components/WeeklyChart';
import { routes } from '../../lib/routes';
import { formatDueIn, getNextDueDate } from '../../utils/taskUtils';
import { Range, useStats } from './useStats';

const RANGE_OPTIONS: { value: Range; label: string }[] = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
  { value: '365', label: '1 year' },
];

export default function StatsScreen() {
  const router = useRouter();
  const { theme, rt } = useUnistyles();
  const {
    range,
    setRange,
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

        <View
          style={[
            styles.headline,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <Text
            style={[
              styles.headlineLabel,
              { color: theme.colors.onPrimaryContainer },
            ]}
          >
            On-time rate
          </Text>
          <Text
            style={[
              styles.headlineValue,
              { color: theme.colors.onPrimaryContainer },
            ]}
          >
            {overall.pct}%
          </Text>
          <Text
            style={[
              styles.headlineSub,
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
            <View style={styles.statLine}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {longestStreak.streak}
              </Text>
              <Text style={[styles.statSub, { color: theme.colors.label2 }]}>
                {longestStreak.task.title}
              </Text>
            </View>
          </MaterialCard>
        )}

        {mostReliable.task && (
          <MaterialCard title="Most reliable" flush>
            <Pressable
              onPress={() =>
                router.push(routes.taskDetail(mostReliable.task!.id))
              }
              android_ripple={{
                color: theme.colors.fill2,
                borderless: false,
              }}
              style={styles.taskLinkRow}
            >
              <TaskTile task={mostReliable.task} size={36} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.linkTitle, { color: theme.colors.text }]}>
                  {mostReliable.task.title}
                </Text>
                <Text style={[styles.linkSub, { color: theme.colors.success }]}>
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
                onPress={() => router.push(routes.taskDetail(x.t.id))}
                android_ripple={{
                  color: theme.colors.fill2,
                  borderless: false,
                }}
                style={[
                  styles.taskLinkRow,
                  i > 0 && {
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.outlineVariant,
                  },
                ]}
              >
                <TaskTile task={x.t} size={36} overdue />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    style={[styles.linkTitle, { color: theme.colors.text }]}
                  >
                    {x.t.title}
                  </Text>
                  <Text style={[styles.linkSub, { color: theme.colors.error }]}>
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
            <View style={styles.statLine}>
              <Text style={[styles.statValue, { color: theme.colors.error }]}>
                {avgLateDrift.toFixed(1)}d
              </Text>
            </View>
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
  headline: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 12,
  },
  headlineLabel: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  headlineValue: {
    fontSize: 56,
    fontWeight: '300',
    lineHeight: 56,
    letterSpacing: -1,
    marginTop: 8,
  },
  headlineSub: {
    fontSize: 14,
    marginTop: 6,
    opacity: 0.8,
  },
  statLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '400',
  },
  statSub: {
    fontSize: 14,
    flex: 1,
  },
  taskLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  linkTitle: {
    fontSize: 15,
  },
  linkSub: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
}));
