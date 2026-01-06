import { Alert, Pressable, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Task } from '../lib/storage';
import {
  formatCadence,
  formatDueIn,
  getNextDueDate,
  getTaskStatus,
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
  const status = getTaskStatus(task);

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
  metadata: {
    gap: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueIn: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  rightContainer: {
    alignItems: 'flex-end',
    gap: 12,
  },
}));
