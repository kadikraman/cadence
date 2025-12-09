import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
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
  const { theme } = useTheme();
  const nextDue = getNextDueDate(task);
  const overdue = isOverdue(task);
  const dueToday = isDueToday(task);
  const dueInText = formatDueIn(nextDue);
  const lastCompletedText = formatLastCompleted(task);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={onViewDetails}
        activeOpacity={0.7}
      >
        <View style={styles.taskInfo}>
          <Text style={[styles.taskTitle, { color: theme.text }]}>
            {task.title}
          </Text>
          <View style={styles.metadata}>
            <Text
              style={[
                styles.dueIn,
                {
                  color: overdue
                    ? theme.error
                    : dueToday
                      ? '#FF9500'
                      : theme.textSecondary,
                },
                (overdue || dueToday) && styles.dueInHighlighted,
              ]}
            >
              {dueInText}
            </Text>
            <Text style={[styles.lastCompleted, { color: theme.textTertiary }]}>
              {lastCompletedText}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onMarkDone}
          style={[styles.markDoneButton, { backgroundColor: theme.primary }]}
          activeOpacity={0.8}
        >
          <Text style={[styles.markDoneText, { color: theme.primaryText }]}>
            Mark as done
          </Text>
        </TouchableOpacity>
        <View style={styles.secondaryActions}>
          <TouchableOpacity
            onPress={onEdit}
            style={styles.actionButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.actionText, { color: theme.text }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            style={styles.deleteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.deleteText, { color: theme.error }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    borderWidth: 1,
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
  },
  metadata: {
    gap: 4,
  },
  dueIn: {
    fontSize: 14,
    fontWeight: '400',
  },
  dueInHighlighted: {
    fontWeight: '600',
  },
  lastCompleted: {
    fontSize: 13,
    fontWeight: '400',
  },
  actions: {
    gap: 12,
  },
  markDoneButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  markDoneText: {
    fontSize: 15,
    fontWeight: '600',
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
  },
  deleteButton: {
    paddingVertical: 4,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
