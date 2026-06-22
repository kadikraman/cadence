import { useObserve } from 'expo-observe';
import { Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import DatePickerSheet from '../../components/DatePickerSheet';
import SegmentedControl from '../../components/ui/SegmentedControl';
import { routes } from '../../lib/routes';
import { getSymbol } from '../../utils/glyphs';
import { computeTaskStats } from '../../utils/statsUtils';
import { getTint } from '../../utils/taskTints';
import {
  formatCadence,
  formatDueIn,
  getNextDueDate,
  getTaskStatus,
  getTodayTimestamp,
  relativeLabel,
} from '../../utils/taskUtils';
import CyclesView from './CyclesView';
import TimelineView from './TimelineView';
import { useTaskDetail } from './useTaskDetail';

export default function TaskDetailScreen() {
  const { theme, rt } = useUnistyles();
  const dark = rt.themeName === 'dark';
  const {
    router,
    task,
    tab,
    setTab,
    datePickerOpen,
    editingEntry,
    openNewDatePicker,
    openEditDatePicker,
    closeDatePicker,
    savePicker,
    markDoneNow,
    deleteCompletion,
    unarchiveOpen,
    openUnarchivePicker,
    closeUnarchivePicker,
    confirmUnarchive,
    unarchiveQuickOptions,
  } = useTaskDetail();

  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  if (!task) return <View style={styles.root} />;

  const archived = !!task.archived;
  const tint = getTint(task.color);
  const tintAccent = dark ? tint.accentDark : tint.accent;
  const status = getTaskStatus(task);
  const overdue = status === 'overdue';
  const nextDue = getNextDueDate(task);
  const completedDates = [...(task.completedDates ?? [])].sort((a, b) => b - a);
  const stats = computeTaskStats(task);

  const heroBg = dark ? tint.tintDark : tint.tint;
  const heroPanelBg = dark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.65)';

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: '',
          headerBackTitle: 'Tasks',
          headerRight: () => (
            <Pressable
              onPress={() => router.push(routes.editTask(task.id))}
              hitSlop={10}
            >
              <Text
                style={{
                  color: theme.colors.blue,
                  fontSize: 17,
                }}
              >
                Edit
              </Text>
            </Pressable>
          ),
        }}
      />
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
                tintColor={tintAccent}
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
                {archived ? 'ARCHIVED' : overdue ? 'OVERDUE' : 'NEXT DUE'}
              </Text>
              <Text
                style={[
                  styles.nextDueValue,
                  {
                    color: archived
                      ? theme.colors.label2
                      : overdue
                        ? theme.colors.error
                        : theme.colors.text,
                  },
                ]}
              >
                {archived
                  ? task.lastCompletedAt
                    ? `Last done ${relativeLabel(task.lastCompletedAt).toLowerCase()}`
                    : 'Never completed'
                  : formatDueIn(nextDue)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatTile
            label="On-time"
            value={`${stats.onTimePct}%`}
            accent={tintAccent}
          />
          <StatTile
            label="Streak"
            value={String(stats.streak)}
            icon="flame.fill"
            accent={theme.colors.warning}
          />
          <StatTile label="Completed" value={String(stats.total)} />
        </View>

        {archived ? (
          <View style={styles.actionsRow}>
            <Pressable
              style={styles.unarchiveBtn}
              onPress={openUnarchivePicker}
            >
              <SymbolView
                name="tray.and.arrow.up.fill"
                size={18}
                tintColor="#fff"
                resizeMode="scaleAspectFit"
                fallback={null}
              />
              <Text style={styles.primaryBtnText}>Unarchive</Text>
            </Pressable>
          </View>
        ) : (
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
        )}

        <View style={styles.tabWrap}>
          <SegmentedControl
            value={tab}
            onChange={setTab}
            options={[
              { value: 'timeline', label: 'Timeline' },
              { value: 'cycles', label: 'Cycles' },
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
      </ScrollView>

      <DatePickerSheet
        visible={datePickerOpen}
        initialDate={editingEntry ?? getTodayTimestamp()}
        mode={editingEntry !== null ? 'edit' : 'new'}
        onClose={closeDatePicker}
        onSave={savePicker}
      />

      <DatePickerSheet
        visible={unarchiveOpen}
        initialDate={getTodayTimestamp()}
        title="Set next due date"
        selectedLabel="Next due"
        quickOptions={unarchiveQuickOptions}
        allowFuture
        onClose={closeUnarchivePicker}
        onSave={confirmUnarchive}
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
  unarchiveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.blue,
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
