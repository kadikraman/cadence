import { useObserve } from 'expo-observe';
import { Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import CompletionSheet from '../../components/CompletionSheet';
import DatePickerSheet from '../../components/DatePickerSheet';
import { routes } from '../../lib/routes';
import { getTint } from '../../utils/taskTints';
import { getTodayTimestamp, relativeLabel } from '../../utils/taskUtils';
import CycleDial from './CycleDial';
import CyclesList from './CyclesList';
import DetailHeader from './DetailHeader';
import StatTrio from './StatTrio';
import { useTaskDetail } from './useTaskDetail';

export default function TaskDetailScreen() {
  const { theme, rt } = useUnistyles();
  const dark = rt.themeName === 'dark';
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
  } = useTaskDetail();

  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  if (!task || !stats) return <View style={styles.root} />;

  const tint = getTint(task.color);
  const accent = dark ? tint.accentDark : tint.accent;

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: '',
          headerBackTitle: 'Tasks',
          headerTransparent: true,
        }}
      />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          onPress={() => router.push(routes.editTask(task.id))}
        >
          Edit
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <ScrollView
        contentContainerStyle={styles.scroll}
        contentInsetAdjustmentBehavior="automatic"
      >
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

        {cycle ? (
          <View style={styles.actionsRow}>
            <Pressable style={styles.primaryBtn} onPress={markDoneNow}>
              <SymbolView
                name="checkmark"
                size={18}
                tintColor="#fff"
                resizeMode="scaleAspectFit"
                fallback={null}
              />
              <Text style={styles.primaryBtnText}>Mark done</Text>
            </Pressable>
            <Pressable
              style={styles.squareBtn}
              onPress={openCompletionSheet}
              accessibilityLabel="Mark done on a date"
            >
              <SymbolView
                name="calendar"
                size={18}
                tintColor={theme.colors.text}
                resizeMode="scaleAspectFit"
                fallback={null}
              />
            </Pressable>
          </View>
        ) : (
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
        )}

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

const styles = StyleSheet.create((theme, rt) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
    paddingLeft: rt.insets.left,
    paddingRight: rt.insets.right,
  },
  scroll: {
    paddingBottom: 40,
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
    gap: 10,
    marginTop: 22,
    marginHorizontal: 16,
  },
  primaryBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  unarchiveBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: theme.colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  squareBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: theme.colors.fill3,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
