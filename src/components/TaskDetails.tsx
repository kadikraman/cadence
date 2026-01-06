import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Task, taskStorage } from '../lib/storage';
import {
  formatCompletionDate,
  formatDueIn,
  formatLastCompleted,
  getNextDueDate,
  isOverdue,
} from '../utils/taskUtils';
import { Stack } from 'expo-router';

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onTaskUpdated: () => void;
  onEdit: () => void;
}

export default function TaskDetails({
  task,
  onClose,
  onTaskUpdated,
  onEdit,
}: TaskDetailsProps) {
  const handleDeleteCompletion = (date: number) => {
    const completionDate = new Date(date);
    const formattedDate = completionDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    Alert.alert(
      'Delete Completion',
      `Are you sure you want to delete the completion from ${formattedDate}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await taskStorage.deleteCompletionDate(task.id, date);
            await onTaskUpdated();
          },
        },
      ]
    );
  };

  const nextDue = getNextDueDate(task);
  const overdue = isOverdue(task);
  const dueInText = formatDueIn(nextDue);
  const lastCompletedText = formatLastCompleted(task);
  const completedDates = [...(task.completedDates || [])].sort((a, b) => b - a);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Task Details',
          headerLeft: () => (
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>Back</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={onEdit}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          {task.details && <Text style={styles.details}>{task.details}</Text>}
          <View style={styles.metadata}>
            <Text style={[styles.dueIn, overdue && styles.dueInOverdue]}>
              {dueInText}
            </Text>
            <Text style={styles.lastCompleted}>{lastCompletedText}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completion History</Text>
          {completedDates.length === 0 ? (
            <Text style={styles.emptyText}>No completions yet</Text>
          ) : (
            <FlatList
              data={completedDates}
              scrollEnabled={false}
              keyExtractor={item => item.toString()}
              renderItem={({ item }) => (
                <View style={styles.completionItem}>
                  <Text style={styles.completionDate}>
                    {formatCompletionDate(item)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteCompletion(item)}
                    style={styles.deleteCompletionButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.deleteCompletionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create(theme => ({
  closeButton: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    paddingHorizontal: 16,
  },
  editButton: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    marginTop: 12,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: -0.3,
    color: theme.colors.text,
  },
  details: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
    color: theme.colors.textSecondary,
  },
  metadata: {
    gap: 6,
  },
  dueIn: {
    fontSize: 16,
    fontWeight: '400',
    color: theme.colors.textSecondary,
  },
  dueInOverdue: {
    fontWeight: '500',
    color: theme.colors.error,
  },
  lastCompleted: {
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.textTertiary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: -0.2,
    color: theme.colors.text,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: theme.colors.textTertiary,
  },
  completionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  completionDate: {
    fontSize: 15,
    fontWeight: '400',
    color: theme.colors.text,
  },
  deleteCompletionButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteCompletionText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.error,
  },
}));
