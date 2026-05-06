import { SymbolView } from 'expo-symbols';
import { memo } from 'react';
import { Alert, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { formatCadence } from '../../utils/taskUtils';
import SwipeRow, { SwipeAction } from '../SwipeRow';
import TaskTile from '../ui/TaskTile';
import ExpandedBar from './ExpandedBar';
import type { TaskRowProps } from './types';
import { useTaskRowVisuals } from './useTaskRowVisuals';

export type { TaskRowCallbacks, TaskRowProps } from './types';

function TaskRow({ task, isExpanded, callbacks }: TaskRowProps) {
  const { theme } = useUnistyles();
  const { overdue, completed, dueLabel, dueColor, borderColor } =
    useTaskRowVisuals(task);

  const showMenu = () => {
    Alert.alert(
      task.title,
      undefined,
      [
        { text: 'Edit', onPress: () => callbacks.onEdit(task) },
        { text: 'View history', onPress: () => callbacks.onOpenHistory(task) },
        { text: 'Pick date', onPress: () => callbacks.onPickDate(task) },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => callbacks.onDelete(task),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const rightActions: SwipeAction[] = [
    {
      label: 'History',
      symbol: 'clock.fill',
      color: theme.colors.textSecondary,
      onPress: () => callbacks.onOpenHistory(task),
    },
    {
      label: 'Edit',
      symbol: 'pencil',
      color: theme.colors.blue,
      onPress: () => callbacks.onEdit(task),
    },
    {
      label: 'Delete',
      symbol: 'trash.fill',
      color: theme.colors.error,
      onPress: () => callbacks.onDelete(task),
    },
  ];

  const leftActions: SwipeAction[] = [
    {
      label: completed ? 'Undo' : 'Done',
      symbol: 'checkmark',
      color: theme.colors.success,
      onPress: () => callbacks.onQuickDone(task),
    },
  ];

  return (
    <SwipeRow
      leftActions={leftActions}
      rightActions={rightActions}
      onTap={() => callbacks.onTap(task)}
      onLongPress={showMenu}
      onCheckTap={() => callbacks.onToggleComplete(task)}
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
        {isExpanded && <ExpandedBar task={task} callbacks={callbacks} />}
      </Animated.View>
    </SwipeRow>
  );
}

export default memo(TaskRow);

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
}));
