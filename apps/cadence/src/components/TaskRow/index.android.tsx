import { Pressable, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatCadence } from '../../utils/taskUtils';
import TaskTile from '../ui/TaskTile';
import ExpandedBar from './ExpandedBar';
import type { TaskRowProps } from './types';
import { useTaskRowVisuals } from './useTaskRowVisuals';

export type { TaskRowActions, TaskRowProps } from './types';

export default function TaskRow({
  task,
  isExpanded,
  onTap,
  actions,
}: TaskRowProps) {
  const { theme } = useUnistyles();
  const { overdue, completed, dueLabel, dueColor, borderColor } =
    useTaskRowVisuals(task);

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
            style={[styles.title, completed && styles.titleCompleted]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          <View style={styles.metaRow}>
            {overdue && !completed && (
              <MaterialCommunityIcons
                name="alert"
                size={14}
                color={theme.colors.error}
              />
            )}
            <Text style={[styles.meta, { color: dueColor }]}>{dueLabel}</Text>
            <Text style={[styles.meta, { color: theme.colors.label3 }]}>·</Text>
            <Text style={[styles.meta, { color: theme.colors.label2 }]}>
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
          style={styles.checkWrap}
        >
          {completed ? (
            <View
              style={[
                styles.checkFilled,
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
            <View style={[styles.checkOutline, { borderColor }]} />
          )}
        </Pressable>
      </Pressable>
      {isExpanded && <ExpandedBar actions={actions} />}
    </Animated.View>
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
    fontSize: 16,
    color: theme.colors.text,
    letterSpacing: 0.15,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  meta: {
    fontSize: 13,
    letterSpacing: 0.25,
  },
  checkWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkFilled: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOutline: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
  },
}));
