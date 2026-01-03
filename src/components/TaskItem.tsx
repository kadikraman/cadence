import { Pressable, Text, View } from 'react-native';
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
import TaskIcon, { getIconColor } from './TaskIcon';

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

  const getContainerStyle = () => {
    return styles.container;
  };

  const getClockIconColor = () => {
    if (status === 'overdue') return theme.colors.error;
    if (status === 'dueToday') return theme.colors.blue;
    return theme.colors.text;
  };

  const iconColor = getIconColor({
    completedToday,
    overdue,
    dueToday,
    theme,
  });

  return (
    <Pressable
      style={getContainerStyle()}
      onPress={onMarkDone}
      onLongPress={onEdit}
    >
      <View style={styles.content}>
        <View style={styles.metadataContainer}>
          <View style={styles.metadata}>
            <EvilIcons name="clock" size={16} color={getClockIconColor()} />
            <Text
              style={[
                styles.dueIn,
                status === 'overdue' && styles.dueInOverdue,
                status === 'dueToday' && styles.dueInToday,
              ]}
            >
              {completedToday ? 'Completed today' : dueInText}
            </Text>
          </View>
          <View style={styles.metadata}>
            <EvilIcons name="refresh" size={18} color={iconColor} />
            <Text
              style={[
                styles.dueIn,
                status === 'overdue' && styles.taskTextOverdue,
                status === 'dueToday' && styles.taskTextDueToday,
              ]}
            >
              {formatCadence(task.cadence)}
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.taskTitle,
            status === 'overdue' && styles.taskTextOverdue,
            status === 'dueToday' && styles.taskTextDueToday,
          ]}
        >
          {task.title}
        </Text>
      </View>
      <View
        style={[styles.icon, status === 'completed' && styles.iconCompleted]}
      >
        <TaskIcon
          completedToday={completedToday}
          overdue={overdue}
          dueToday={dueToday}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    borderRadius: 32,
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
    boxShadow: theme.shadows.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: theme.colors.surface,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 20,
  },
  iconCompleted: {
    borderColor: theme.colors.border,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    gap: 8,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
  },
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  dueInOverdue: {
    color: theme.colors.error,
  },
  dueInToday: {
    color: theme.colors.blue,
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
}));
