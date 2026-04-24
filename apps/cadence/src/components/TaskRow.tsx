import { SymbolView } from 'expo-symbols';
import { Alert, Platform, Pressable, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Task } from '../lib/types';
import {
  formatCadence,
  formatDueIn,
  getNextDueDate,
  getTaskStatus,
} from '../utils/taskUtils';
import InlineActionBtn from './InlineActionBtn';
import SwipeRow, { SwipeAction } from './SwipeRow';
import TaskTile from './ui/TaskTile';

const IS_ANDROID = Platform.OS === 'android';

export interface TaskRowActions {
  toggleComplete: () => void;
  quickDone: () => void;
  edit: () => void;
  delete: () => void;
  openHistory: () => void;
  pickDate: () => void;
}

interface TaskRowProps {
  task: Task;
  isExpanded: boolean;
  onTap: () => void;
  actions: TaskRowActions;
}

export default function TaskRow({
  task,
  isExpanded,
  onTap,
  actions,
}: TaskRowProps) {
  const { theme } = useUnistyles();
  const status = getTaskStatus(task);
  const overdue = status === 'overdue';
  const dueToday = status === 'dueToday';
  const completed = status === 'completed';
  const nextDue = getNextDueDate(task);
  const dueLabel = formatDueIn(nextDue);

  const dueColor = overdue
    ? theme.colors.error
    : dueToday
      ? theme.colors.blue
      : theme.colors.label3;
  const borderColor = overdue
    ? theme.colors.error
    : dueToday
      ? theme.colors.blue
      : theme.colors.label4;

  const showMenu = () => {
    Alert.alert(
      task.title,
      undefined,
      [
        { text: 'Edit', onPress: actions.edit },
        { text: 'View history', onPress: actions.openHistory },
        { text: 'Pick date', onPress: actions.pickDate },
        { text: 'Delete', style: 'destructive', onPress: actions.delete },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  if (IS_ANDROID) {
    return (
      <Animated.View layout={LinearTransition.duration(220)}>
        <Pressable
          onPress={onTap}
          android_ripple={{ color: theme.colors.fill2, borderless: false }}
          style={styles.row}
        >
          <TaskTile task={task} size={40} overdue={overdue && !completed} />
          <View style={styles.middle}>
            <Text
              style={[styles.androidTitle, completed && styles.titleCompleted]}
              numberOfLines={1}
            >
              {task.title}
            </Text>
            <View style={styles.androidMetaRow}>
              {overdue && !completed && (
                <MaterialCommunityIcons
                  name="alert"
                  size={14}
                  color={theme.colors.error}
                />
              )}
              <Text style={[styles.androidMeta, { color: dueColor }]}>
                {dueLabel}
              </Text>
              <Text
                style={[styles.androidMeta, { color: theme.colors.label3 }]}
              >
                ·
              </Text>
              <Text
                style={[styles.androidMeta, { color: theme.colors.label2 }]}
              >
                {formatCadence(task.cadence)}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={actions.toggleComplete}
            hitSlop={10}
            android_ripple={{
              color: theme.colors.fill2,
              borderless: true,
              radius: 20,
            }}
            style={styles.androidCheckWrap}
          >
            {completed ? (
              <View
                style={[
                  styles.androidCheckFilled,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <MaterialCommunityIcons
                  name="check"
                  size={14}
                  color={theme.colors.onPrimary}
                />
              </View>
            ) : (
              <View
                style={[
                  styles.androidCheckOutline,
                  { borderColor: borderColor },
                ]}
              />
            )}
          </Pressable>
        </Pressable>
        {isExpanded && (
          <Animated.View
            entering={FadeIn.duration(160)}
            exiting={FadeOut.duration(120)}
            style={styles.inlineBar}
          >
            <InlineActionBtn
              label="Done today"
              symbol="checkmark"
              color={theme.colors.success}
              onPress={actions.quickDone}
            />
            <InlineActionBtn
              label="Pick date"
              symbol="calendar"
              onPress={actions.pickDate}
            />
            <InlineActionBtn
              label="Edit"
              symbol="pencil"
              onPress={actions.edit}
            />
            <InlineActionBtn
              label="History"
              symbol="clock.fill"
              onPress={actions.openHistory}
            />
          </Animated.View>
        )}
      </Animated.View>
    );
  }

  const rightActions: SwipeAction[] = [
    {
      label: 'History',
      symbol: 'clock.fill',
      color: theme.colors.textSecondary,
      onPress: actions.openHistory,
    },
    {
      label: 'Edit',
      symbol: 'pencil',
      color: theme.colors.blue,
      onPress: actions.edit,
    },
    {
      label: 'Delete',
      symbol: 'trash.fill',
      color: theme.colors.error,
      onPress: actions.delete,
    },
  ];

  const leftActions: SwipeAction[] = [
    {
      label: completed ? 'Undo' : 'Done',
      symbol: 'checkmark',
      color: theme.colors.success,
      onPress: actions.quickDone,
    },
  ];

  return (
    <SwipeRow
      leftActions={leftActions}
      rightActions={rightActions}
      onTap={onTap}
      onLongPress={showMenu}
      onCheckTap={actions.toggleComplete}
    >
      <Animated.View layout={LinearTransition.duration(220)}>
        <View style={styles.row}>
          <TaskTile task={task} size={40} overdue={overdue && !completed} />
          <View style={styles.middle}>
            <Text
              style={[styles.title, completed && styles.titleCompleted]}
              numberOfLines={1}
            >
              {task.title}
            </Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                {overdue && !completed && (
                  <SymbolView
                    name="exclamationmark.triangle.fill"
                    size={11}
                    tintColor={theme.colors.error}
                    resizeMode="scaleAspectFit"
                    fallback={null}
                  />
                )}
                <Text style={[styles.metaText, { color: dueColor }]}>
                  {dueLabel}
                </Text>
              </View>
              <Text style={styles.metaDivider}>·</Text>
              <View style={styles.metaItem}>
                <SymbolView
                  name="arrow.triangle.2.circlepath"
                  size={11}
                  tintColor={theme.colors.label3}
                  resizeMode="scaleAspectFit"
                  fallback={null}
                />
                <Text style={styles.cadenceText}>
                  {formatCadence(task.cadence)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.checkWrap}>
            {completed ? (
              <SymbolView
                name="checkmark.circle.fill"
                size={28}
                tintColor={theme.colors.success}
                resizeMode="scaleAspectFit"
                fallback={null}
              />
            ) : (
              <View style={[styles.checkCircle, { borderColor }]} />
            )}
          </View>
        </View>
        {isExpanded && (
          <Animated.View
            entering={FadeIn.duration(160)}
            exiting={FadeOut.duration(120)}
            style={styles.inlineBar}
          >
            <InlineActionBtn
              label="Done today"
              symbol="checkmark"
              color={theme.colors.success}
              onPress={actions.quickDone}
            />
            <InlineActionBtn
              label="Pick date"
              symbol="calendar"
              onPress={actions.pickDate}
            />
            <InlineActionBtn
              label="Edit"
              symbol="pencil"
              onPress={actions.edit}
            />
            <InlineActionBtn
              label="History"
              symbol="clock.fill"
              onPress={actions.openHistory}
            />
          </Animated.View>
        )}
      </Animated.View>
    </SwipeRow>
  );
}

const styles = StyleSheet.create(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  middle: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
    color: theme.colors.text,
    letterSpacing: -0.4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.08,
  },
  metaDivider: {
    color: theme.colors.label4,
    fontSize: 13,
  },
  cadenceText: {
    fontSize: 13,
    color: theme.colors.label3,
  },
  checkWrap: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
  },
  inlineBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.sepSubtle,
    marginTop: -2,
  },
  androidTitle: {
    fontSize: 16,
    color: theme.colors.text,
    letterSpacing: 0.15,
  },
  androidMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  androidMeta: {
    fontSize: 13,
    letterSpacing: 0.25,
  },
  androidCheckWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  androidCheckFilled: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  androidCheckOutline: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
  },
}));
