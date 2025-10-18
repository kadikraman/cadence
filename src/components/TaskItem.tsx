import { SymbolView } from 'expo-symbols';
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

  const getStatusIcon = () => {
    switch (dueStatus) {
      case 'overdue':
        return 'exclamationmark.triangle.fill';
      case 'due-today':
        return 'sun.max.fill';
      case 'due-tomorrow':
        return 'moon.fill';
      case 'due-soon':
        return 'clock.fill';
      default:
        return 'clock';
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
            <SymbolView
              name={getStatusIcon()}
              style={styles.statusIcon}
              tintColor="white"
              type="monochrome"
            />
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        {task.description && (
          <Text style={styles.description}>{task.description}</Text>
        )}

        <View style={styles.footer}>
          <View style={styles.dueDateContainer}>
            <SymbolView
              name="calendar"
              style={styles.dueDateIcon}
              tintColor="#007AFF"
              type="hierarchical"
            />
            <Text style={styles.dueDate}>
              {formatDueDate(task.nextDueDate)}
            </Text>
          </View>
          <View style={styles.cadenceContainer}>
            <SymbolView
              name="repeat"
              style={styles.cadenceIcon}
              tintColor="#8E8E93"
              type="monochrome"
            />
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
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.completeButton]}
          onPress={() => onComplete(task)}
        >
          <SymbolView
            name="checkmark"
            style={styles.actionIcon}
            tintColor="white"
            type="monochrome"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(task)}
        >
          <SymbolView
            name="pencil"
            style={styles.actionIcon}
            tintColor="white"
            type="monochrome"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <SymbolView
            name="trash"
            style={styles.actionIcon}
            tintColor="white"
            type="monochrome"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    fontSize: 19,
    fontWeight: '600',
    color: '#1D1D1F',
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  statusIcon: {
    width: 12,
    height: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 12,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dueDateIcon: {
    width: 14,
    height: 14,
  },
  dueDate: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '500',
  },
  cadenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cadenceIcon: {
    width: 14,
    height: 14,
  },
  cadence: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '400',
  },
  actions: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    gap: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completeButton: {
    backgroundColor: '#34C759',
  },
  editButton: {
    backgroundColor: '#8E8E93',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionIcon: {
    width: 18,
    height: 18,
  },
});
