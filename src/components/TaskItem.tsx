import { Alert, Pressable, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Task } from '../lib/storage';
import {
  formatCadence,
  formatDueIn,
  getNextDueDate,
  isCompletedToday,
  isDueToday,
  isOverdue,
} from '../utils/taskUtils';
import TaskIcon from './TaskIcon';
import TaskMetadata from './TaskMetadata';
import * as Haptics from 'expo-haptics';

interface TaskItemProps {
  task: Task;
  onMarkDone: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
}

export default function TaskItem({
  task,
  onMarkDone,
  onEdit,
  onDelete,
  onViewDetails,
}: TaskItemProps) {
  const { theme } = useUnistyles();
  const nextDue = getNextDueDate(task);
  const overdue = isOverdue(task);
  const dueToday = isDueToday(task);
  const completedToday = isCompletedToday(task);
  const dueInText = formatDueIn(nextDue);

  const getTaskStatus = () => {
    if (completedToday) return 'completed';
    if (overdue) return 'overdue';
    if (dueToday) return 'dueToday';
    return 'default';
  };

  const status = getTaskStatus();

  const onMenuPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Item Actions',
      `What would you like to do with "${task.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Edit',
          onPress: onEdit,
        },
        {
          text: 'View History',
          onPress: onViewDetails,
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onDelete,
        },
      ]
    );
  };

  return (
    <Animated.View layout={LinearTransition}>
      <Pressable
        style={styles.container}
        onPress={onMarkDone}
        onLongPress={onMenuPress}
      >
        <View style={styles.content}>
          <TaskMetadata
            status={status}
            completedToday={completedToday}
            dueInText={dueInText}
          />
          <Text style={styles.taskTitle}>{task.title}</Text>
        </View>
        <View style={styles.rightContainer}>
          <View style={styles.metadata}>
            <EvilIcons name="refresh" size={18} color={theme.colors.text} />
            <Text style={[styles.dueIn]}>{formatCadence(task.cadence)}</Text>
          </View>
          <TaskIcon
            completedToday={completedToday}
            overdue={overdue}
            dueToday={dueToday}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  taskTextOverdue: {
    color: theme.colors.error,
  },
  taskTextDueToday: {
    color: theme.colors.blue,
  },
  taskTitleCompleted: {
    color: theme.colors.textSecondary,
  },
  metadata: {
    gap: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueIn: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  lastCompleted: {
    fontSize: 13,
    fontWeight: '400',
    color: theme.colors.textTertiary,
  },
  actions: {
    gap: 12,
  },
  markDoneButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
  },
  markDoneText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.primaryText,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
  },
  actionButton: {
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text,
  },
  deleteButton: {
    paddingVertical: 4,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.error,
  },
  rightContainer: {
    alignItems: 'flex-end',
    gap: 12,
  },
}));
