import { SymbolView } from 'expo-symbols';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import DatePickerSheet from '../../components/DatePickerSheet';
import SegmentedControl from '../../components/ui/SegmentedControl';
import { Task, taskStorage } from '../../lib/storage';
import { computeTaskStats } from '../../utils/statsUtils';
import { getSymbol } from '../../utils/glyphs';
import { getTint } from '../../utils/taskTints';
import {
  formatCadence,
  formatDueIn,
  getNextDueDate,
  getTaskStatus,
} from '../../utils/taskUtils';
import CalendarView from './CalendarView';
import CyclesView from './CyclesView';
import TimelineView from './TimelineView';

type Tab = 'timeline' | 'cycles' | 'calendar';

export default function TaskDetailScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const router = useRouter();
  const { theme, rt } = useUnistyles();
  const dark = rt.themeName === 'dark';

  const [task, setTask] = useState<Task | null>(null);
  const [tab, setTab] = useState<Tab>('timeline');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!taskId) return;
    const t = await taskStorage.getTask(taskId);
    setTask(t);
  }, [taskId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (!task) return <View style={styles.root} />;

  const tint = getTint(task.color);
  const status = getTaskStatus(task);
  const overdue = status === 'overdue';
  const nextDue = getNextDueDate(task);
  const completedDates = [...(task.completedDates ?? [])].sort((a, b) => b - a);
  const stats = computeTaskStats(task);

  const heroBg = dark ? tint.tintDark : tint.tint;
  const heroPanelBg = dark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.65)';

  const openNewDatePicker = () => {
    setEditingEntry(null);
    setDatePickerOpen(true);
  };

  const openEditDatePicker = (ts: number) => {
    setEditingEntry(ts);
    setDatePickerOpen(true);
  };

  const savePicker = async (ts: number) => {
    if (!task) return;
    if (editingEntry !== null) {
      await taskStorage.editCompletionDate(task.id, editingEntry, ts);
    } else {
      await taskStorage.markTaskCompleted(task.id, ts);
    }
    setDatePickerOpen(false);
    setEditingEntry(null);
    await load();
  };

  const markDoneNow = async () => {
    await taskStorage.markTaskCompleted(task.id);
    await load();
  };

  const deleteCompletion = async (ts: number) => {
    await taskStorage.deleteCompletionDate(task.id, ts);
    await load();
  };

  const addCompletion = async (ts: number) => {
    await taskStorage.markTaskCompleted(task.id, ts);
    await load();
  };

  return (
    <View style={[styles.root, { paddingTop: rt.insets.top }]}>
      <View style={styles.navBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Back"
        >
          <SymbolView
            name="chevron.left"
            size={18}
            tintColor={theme.colors.blue}
            resizeMode="scaleAspectFit"
            fallback={null}
          />
          <Text style={styles.backText}>Tasks</Text>
        </Pressable>
        <Pressable onPress={() => router.push(`/new?taskId=${task.id}`)}>
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.hero, { backgroundColor: heroBg }]}>
          <View style={styles.heroHeader}>
            <View
              style={[
                styles.heroTile,
                {
                  backgroundColor: dark
                    ? 'rgba(0,0,0,0.2)'
                    : 'rgba(255,255,255,0.6)',
                },
              ]}
            >
              <SymbolView
                name={getSymbol(task.glyph)}
                size={28}
                tintColor={tint.accent}
                resizeMode="scaleAspectFit"
                fallback={null}
              />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>{task.title}</Text>
              <View style={styles.heroCadenceRow}>
                <SymbolView
                  name="arrow.triangle.2.circlepath"
                  size={13}
                  tintColor={
                    dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.6)'
                  }
                  resizeMode="scaleAspectFit"
                  fallback={null}
                />
                <Text style={styles.heroCadence}>
                  {formatCadence(task.cadence)}
                </Text>
              </View>
            </View>
          </View>

          {task.details ? (
            <Text style={styles.heroDetails}>{task.details}</Text>
          ) : null}

          <View style={[styles.nextDuePanel, { backgroundColor: heroPanelBg }]}>
            <View style={styles.nextDueRow}>
              <Text style={styles.nextDueLabel}>
                {overdue ? 'OVERDUE' : 'NEXT DUE'}
              </Text>
              <Text
                style={[
                  styles.nextDueValue,
                  { color: overdue ? theme.colors.error : theme.colors.text },
                ]}
              >
                {formatDueIn(nextDue)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatTile
            label="On-time"
            value={`${stats.onTimePct}%`}
            accent={tint.accent}
          />
          <StatTile
            label="Streak"
            value={String(stats.streak)}
            icon="flame.fill"
            accent={theme.colors.warning}
          />
          <StatTile label="Completed" value={String(stats.total)} />
        </View>

        <View style={styles.actionsRow}>
          <Pressable style={styles.primaryBtn} onPress={markDoneNow}>
            <SymbolView
              name="checkmark"
              size={18}
              tintColor="#fff"
              resizeMode="scaleAspectFit"
              fallback={null}
            />
            <Text style={styles.primaryBtnText}>Mark done now</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={openNewDatePicker}>
            <SymbolView
              name="calendar"
              size={16}
              tintColor={theme.colors.text}
              resizeMode="scaleAspectFit"
              fallback={null}
            />
            <Text style={styles.secondaryBtnText}>Date…</Text>
          </Pressable>
        </View>

        <View style={styles.tabWrap}>
          <SegmentedControl
            value={tab}
            onChange={setTab}
            options={[
              { value: 'timeline', label: 'Timeline' },
              { value: 'cycles', label: 'Cycles' },
              { value: 'calendar', label: 'Calendar' },
            ]}
          />
        </View>

        {tab === 'timeline' && (
          <TimelineView
            task={task}
            completedDates={completedDates}
            onEditEntry={openEditDatePicker}
            onDeleteEntry={deleteCompletion}
          />
        )}
        {tab === 'cycles' && (
          <CyclesView task={task} completedDates={completedDates} />
        )}
        {tab === 'calendar' && (
          <CalendarView
            task={task}
            completedDates={completedDates}
            onDayTap={addCompletion}
          />
        )}
      </ScrollView>

      <DatePickerSheet
        visible={datePickerOpen}
        initialDate={editingEntry ?? Date.now()}
        mode={editingEntry !== null ? 'edit' : 'new'}
        onClose={() => {
          setDatePickerOpen(false);
          setEditingEntry(null);
        }}
        onSave={savePicker}
      />
    </View>
  );
}

function StatTile({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string;
  accent?: string;
  icon?: Parameters<typeof SymbolView>[0]['name'];
}) {
  const { theme } = useUnistyles();
  return (
    <View style={statTileStyles.tile}>
      <Text style={statTileStyles.label}>{label}</Text>
      <View style={statTileStyles.valueRow}>
        {icon && (
          <SymbolView
            name={icon}
            size={15}
            tintColor={accent}
            resizeMode="scaleAspectFit"
            fallback={null}
          />
        )}
        <Text
          style={[statTileStyles.value, { color: accent ?? theme.colors.text }]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

const statTileStyles = StyleSheet.create(theme => ({
  tile: {
    flex: 1,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  label: {
    fontSize: 11,
    color: theme.colors.label3,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
    marginTop: 3,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 24,
  },
}));

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.sepSubtle,
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
  editText: {
    color: theme.colors.blue,
    fontSize: 17,
    padding: 4,
  },
  scroll: {
    paddingBottom: 40,
  },
  hero: {
    margin: 16,
    padding: 18,
    borderRadius: 20,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroTile: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    flex: 1,
    minWidth: 0,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  heroCadenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  heroCadence: {
    fontSize: 14,
    color: theme.colors.label2,
  },
  heroDetails: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.label2,
    lineHeight: 19,
  },
  nextDuePanel: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
  },
  nextDueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  nextDueLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.label2,
    letterSpacing: 0.3,
  },
  nextDueValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 14,
    gap: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 18,
    gap: 10,
  },
  primaryBtn: {
    flex: 2,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.fill3,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  secondaryBtnText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  tabWrap: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
}));
