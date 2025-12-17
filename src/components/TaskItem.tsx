import { Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Task } from '../lib/storage';
import {
  formatDueIn,
  formatLastCompleted,
  getNextDueDate,
  isDueToday,
  isOverdue,
} from '../utils/taskUtils';

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
  const nextDue = getNextDueDate(task);
  const overdue = isOverdue(task);
  const dueToday = isDueToday(task);
  const dueInText = formatDueIn(nextDue);
  const lastCompletedText = formatLastCompleted(task);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.content}
        onPress={onViewDetails}
        activeOpacity={0.7}
      >
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <View style={styles.metadata}>
            <Text
              style={[
                styles.dueIn,
                (overdue || dueToday) && styles.dueInHighlighted,
                overdue && styles.dueInOverdue,
                dueToday && styles.dueInToday,
              ]}
            >
              {dueInText}
            </Text>
            <Text style={styles.lastCompleted}>{lastCompletedText}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onMarkDone}
          style={styles.markDoneButton}
          activeOpacity={0.8}
        >
          <Text style={styles.markDoneText}>Mark as done</Text>
        </TouchableOpacity>
        <View style={styles.secondaryActions}>
          <TouchableOpacity
            onPress={onEdit}
            style={styles.actionButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            style={styles.deleteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    borderWidth: 1,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  content: {
    marginBottom: 16,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 8,
    letterSpacing: -0.2,
    color: theme.colors.text,
  },
  metadata: {
    gap: 4,
  },
  dueIn: {
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.textSecondary,
  },
  dueInHighlighted: {
    fontWeight: '600',
  },
  dueInOverdue: {
    color: theme.colors.error,
  },
  dueInToday: {
    color: '#FF9500',
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
