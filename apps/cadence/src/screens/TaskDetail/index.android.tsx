import { Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePickerSheet from '../../components/DatePickerSheet';
import IconButton from '../../components/ui/IconButton';
import { routes } from '../../lib/routes';
import MaterialButton from '../../components/ui/android/MaterialButton';
import MaterialTabs from '../../components/ui/android/MaterialTabs';
import TopAppBar from '../../components/ui/android/TopAppBar';
import { getMaterialIcon, getSymbol } from '../../utils/glyphs';
import { computeTaskStats } from '../../utils/statsUtils';
import { getTint } from '../../utils/taskTints';
import {
  formatCadence,
  formatDueIn,
  getNextDueDate,
  getTaskStatus,
} from '../../utils/taskUtils';
import CyclesView from './CyclesView';
import TimelineView from './TimelineView';
import { Tab, useTaskDetail } from './useTaskDetail';

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
  } = useTaskDetail();

  if (!task) return <View style={styles.root} />;

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
    <View style={[styles.root, { paddingTop: rt.insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <TopAppBar
        title=""
        onBack={() => router.back()}
        right={
          <IconButton
            symbol="pencil"
            onPress={() => router.push(routes.editTask(task.id))}
            accessibilityLabel="Edit task"
          />
        }
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
                    : 'rgba(255,255,255,0.55)',
                },
              ]}
            >
              <SymbolView
                name={getSymbol(task.glyph)}
                size={30}
                tintColor={tintAccent}
                resizeMode="scaleAspectFit"
                fallback={
                  <MaterialCommunityIcons
                    name={getMaterialIcon(task.glyph)}
                    size={30}
                    color={tintAccent}
                  />
                }
              />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>{task.title}</Text>
              <View style={styles.heroCadenceRow}>
                <MaterialCommunityIcons
                  name="repeat"
                  size={14}
                  color={theme.colors.label2}
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
            <Text style={styles.nextDueLabel}>
              {overdue ? 'OVERDUE' : 'NEXT DUE'}
            </Text>
            <Text
              style={[
                styles.nextDueValue,
                {
                  color: overdue ? theme.colors.error : theme.colors.text,
                },
              ]}
            >
              {formatDueIn(nextDue)}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatChip label="On-time" value={`${stats.onTimePct}%`} />
          <StatChip
            label="Streak"
            value={String(stats.streak)}
            icon="fire"
            iconColor={theme.colors.warning}
          />
          <StatChip label="Completed" value={String(stats.total)} />
        </View>

        <View style={styles.actionsRow}>
          <MaterialButton onPress={markDoneNow} icon="check" full>
            Mark done
          </MaterialButton>
          <MaterialButton
            onPress={openNewDatePicker}
            variant="tonal"
            icon="calendar"
          >
            Pick date
          </MaterialButton>
        </View>

        <MaterialTabs<Tab>
          value={tab}
          onChange={setTab}
          options={[
            { value: 'timeline', label: 'Timeline' },
            { value: 'cycles', label: 'Cycles' },
          ]}
        />

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
        initialDate={editingEntry ?? Date.now()}
        mode={editingEntry !== null ? 'edit' : 'new'}
        onClose={closeDatePicker}
        onSave={savePicker}
      />
    </View>
  );
}

function StatChip({
  label,
  value,
  icon,
  iconColor,
}: {
  label: string;
  value: string;
  icon?: string;
  iconColor?: string;
}) {
  const { theme } = useUnistyles();
  return (
    <View
      style={[
        chipStyles.chip,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <Text style={[chipStyles.label, { color: theme.colors.label2 }]}>
        {label}
      </Text>
      <View style={chipStyles.valueRow}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={16}
            color={iconColor ?? theme.colors.text}
          />
        )}
        <Text style={[chipStyles.value, { color: theme.colors.text }]}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const chipStyles = StyleSheet.create(() => ({
  chip: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 3,
  },
  value: {
    fontSize: 22,
    fontWeight: '400',
  },
}));

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
  },
  scroll: {
    paddingBottom: 80,
  },
  hero: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
    borderRadius: 28,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  heroTile: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    flex: 1,
    minWidth: 0,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '400',
    color: theme.colors.text,
    letterSpacing: -0.25,
    lineHeight: 30,
  },
  heroCadenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  heroCadence: {
    fontSize: 14,
    color: theme.colors.label2,
    letterSpacing: 0.25,
  },
  heroDetails: {
    marginTop: 14,
    fontSize: 14,
    color: theme.colors.label2,
    lineHeight: 20,
  },
  nextDuePanel: {
    marginTop: 18,
    padding: 14,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  nextDueLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.label2,
    letterSpacing: 0.5,
  },
  nextDueValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 20,
  },
}));
