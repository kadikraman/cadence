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
import TaskIcon from './TaskIcon';

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
    const baseStyle = styles.container;
    if (status === 'overdue') {
      return [baseStyle, styles.containerOverdue];
    }
    if (status === 'dueToday') {
      return [baseStyle, styles.containerDueToday];
    }
    return baseStyle;
  };

  const getClockIconColor = () => {
    if (status === 'overdue') return theme.colors.error;
    if (status === 'dueToday') return theme.colors.blue;
    return theme.colors.text;
  };

  return (
    <View style={getContainerStyle()}>
      <Pressable style={styles.content} onPress={onViewDetails}>
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
            <EvilIcons name="refresh" size={18} color={theme.colors.text} />
            <Text style={styles.dueIn}>{formatCadence(task.cadence)}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.taskTitle,
            status === 'overdue' && styles.taskTitleOverdue,
            status === 'dueToday' && styles.taskTitleDueToday,
          ]}
        >
          {task.title}
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.icon,
          status === 'overdue' && styles.iconOverdue,
          status === 'dueToday' && styles.iconDueToday,
          status === 'completed' && styles.iconCompleted,
        ]}
        onPress={onMarkDone}
      >
        <TaskIcon
          completedToday={completedToday}
          overdue={overdue}
          dueToday={dueToday}
        />
      </Pressable>
    </View>
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
  },
  containerOverdue: {
    backgroundColor: hexToRgba(theme.colors.error, 0.08),
    borderWidth: 1,
    borderColor: hexToRgba(theme.colors.error, 0.25),
  },
  containerDueToday: {
    backgroundColor: hexToRgba(theme.colors.blue, 0.08),
    borderWidth: 1,
    borderColor: hexToRgba(theme.colors.blue, 0.25),
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
  iconOverdue: {
    borderColor: hexToRgba(theme.colors.error, 0.38),
    backgroundColor: hexToRgba(theme.colors.error, 0.06),
  },
  iconDueToday: {
    borderColor: hexToRgba(theme.colors.blue, 0.38),
    backgroundColor: hexToRgba(theme.colors.blue, 0.06),
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
  taskTitleOverdue: {
    color: theme.colors.error,
  },
  taskTitleDueToday: {
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
