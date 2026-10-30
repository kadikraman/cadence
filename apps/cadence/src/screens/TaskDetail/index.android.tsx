import { useObserve } from 'expo-observe';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import CompletionSheet from '../../components/CompletionSheet';
import DatePickerSheet from '../../components/DatePickerSheet';
import IconButton from '../../components/ui/IconButton';
import MaterialButton from '../../components/ui/android/MaterialButton';
import TopAppBar from '../../components/ui/android/TopAppBar';
import { routes } from '../../lib/routes';
import { getTint } from '../../utils/taskTints';
import { getTodayTimestamp, relativeLabel } from '../../utils/taskUtils';
import CycleDial from './CycleDial';
import CyclesList from './CyclesList';
import DetailHeader from './DetailHeader';
import StatTrio from './StatTrio';
import { useTaskDetail } from './useTaskDetail';

export default function TaskDetailScreen() {
  const { rt } = useUnistyles();
  const dark = rt.themeName === 'dark';
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const {
    router,
    task,
    stats,
    history,
    cycle,
    datePickerOpen,
    editingEntry,
    openEditDatePicker,
    closeDatePicker,
    savePicker,
    markDoneNow,
    deleteCompletion,
    completionSheetOpen,
    openCompletionSheet,
    closeCompletionSheet,
    confirmCompletion,
    unarchiveOpen,
    openUnarchivePicker,
    closeUnarchivePicker,
    confirmUnarchive,
    unarchiveQuickOptions,
  } = useTaskDetail(taskId);

  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  if (!task || !stats) return <View style={styles.root} />;

  const tint = getTint(task.color);
  const accent = dark ? tint.accentDark : tint.accent;

  return (
    <View style={[styles.root, { paddingTop: rt.insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <TopAppBar
        title=""
        variant="small"
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
        <DetailHeader task={task} />

        {cycle ? (
          <View style={styles.dialWrap}>
            <CycleDial cycle={cycle} accent={accent} />
          </View>
        ) : (
          <Text style={styles.archivedNote}>
            Archived ·{' '}
            {task.lastCompletedAt
              ? `last done ${relativeLabel(task.lastCompletedAt).toLowerCase()}`
              : 'never completed'}
          </Text>
        )}

        <View style={styles.trio}>
          <StatTrio stats={stats} />
        </View>

        <View style={styles.actionsRow}>
          {cycle ? (
            <>
              <MaterialButton onPress={markDoneNow} icon="check" full>
                Mark done
              </MaterialButton>
              <MaterialButton
                onPress={openCompletionSheet}
                variant="tonal"
                icon="calendar"
              >
                Pick date
              </MaterialButton>
            </>
          ) : (
            <MaterialButton
              onPress={openUnarchivePicker}
              icon="tray-arrow-up"
              full
            >
              Unarchive
            </MaterialButton>
          )}
        </View>

        <CyclesList
          task={task}
          cycle={cycle}
          history={history}
          accent={accent}
          onEditEntry={openEditDatePicker}
          onDeleteEntry={deleteCompletion}
        />
      </ScrollView>

      <DatePickerSheet
        visible={datePickerOpen}
        initialDate={editingEntry ?? getTodayTimestamp()}
        mode="edit"
        onClose={closeDatePicker}
        onSave={savePicker}
      />

      <CompletionSheet
        visible={completionSheetOpen}
        task={task}
        onClose={closeCompletionSheet}
        onConfirm={confirmCompletion}
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

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
  },
  scroll: {
    paddingBottom: 80,
  },
  dialWrap: {
    alignItems: 'center',
    paddingTop: 10,
  },
  archivedNote: {
    fontSize: 15,
    color: theme.colors.label2,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  trio: {
    marginTop: 6,
    marginHorizontal: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 22,
    marginHorizontal: 16,
  },
}));
