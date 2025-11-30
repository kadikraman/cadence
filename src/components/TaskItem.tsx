import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../lib/storage';
import { getNextDueDate, formatDueIn, formatLastCompleted, isOverdue } from '../utils/taskUtils';

interface TaskItemProps {
  task: Task;
  onMarkDone: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskItem({
  task,
  onMarkDone,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const nextDue = getNextDueDate(task);
  const overdue = isOverdue(task);
  const dueInText = formatDueIn(nextDue);
  const lastCompletedText = formatLastCompleted(task);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <View style={styles.metadata}>
            <Text
              style={[
                styles.dueIn,
                overdue && styles.dueInOverdue,
              ]}
            >
              {dueInText}
            </Text>
            <Text style={styles.lastCompleted}>{lastCompletedText}</Text>
          </View>
        </View>
      </View>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
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
    color: '#000',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  metadata: {
    gap: 4,
  },
  dueIn: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  dueInOverdue: {
    color: '#FF3B30',
    fontWeight: '500',
  },
  lastCompleted: {
    fontSize: 13,
    color: '#999',
    fontWeight: '400',
  },
  actions: {
    gap: 12,
  },
  markDoneButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  markDoneText: {
    color: '#fff',
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
    color: '#000',
    fontWeight: '500',
  },
  deleteButton: {
    paddingVertical: 4,
  },
  deleteText: {
    fontSize: 15,
    color: '#FF3B30',
    fontWeight: '500',
  },
});

