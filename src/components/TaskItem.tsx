import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Task } from '../lib/db';
import { formatDueDate, getTaskDueStatus } from '../utils/taskUtils';

interface TaskItemProps {
  task: Task;
  onComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskItem({
  task,
  onComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const dueStatus = getTaskDueStatus(task);

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDelete(task),
      },
    ]);
  };

  const getStatusColor = () => {
    switch (dueStatus) {
      case 'overdue':
        return '#FF3B30';
      case 'due-today':
        return '#FF9500';
      case 'due-tomorrow':
        return '#FFCC00';
      case 'due-soon':
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };

  const getStatusText = () => {
    switch (dueStatus) {
      case 'overdue':
        return 'Overdue';
      case 'due-today':
        return 'Due Today';
      case 'due-tomorrow':
        return 'Due Tomorrow';
      case 'due-soon':
        return 'Due Soon';
      default:
        return 'Due Later';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{task.name}</Text>
          <View
            style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
          >
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        {task.description && (
          <Text style={styles.description}>{task.description}</Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.dueDate}>{formatDueDate(task.nextDueDate)}</Text>
          <Text style={styles.cadence}>
            {(() => {
              const getSingularForm = (cadenceType: string): string => {
                switch (cadenceType) {
                  case 'daily':
                    return 'day';
                  case 'weekly':
                    return 'week';
                  case 'monthly':
                    return 'month';
                  case 'yearly':
                    return 'year';
                  default:
                    return cadenceType.slice(0, -2);
                }
              };

              const singular = getSingularForm(task.cadenceType);

              if (task.cadenceInterval === 1) {
                return `Every ${singular}`;
              }
              return `Every ${task.cadenceInterval} ${singular}s`;
            })()}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.completeButton]}
          onPress={() => onComplete(task)}
        >
          <Text style={styles.completeButtonText}>✓</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(task)}
        >
          <Text style={styles.editButtonText}>✏</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  cadence: {
    fontSize: 12,
    color: '#8E8E93',
  },
  actions: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#34C759',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#8E8E93',
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
  },
});
