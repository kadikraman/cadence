import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { Task, taskStorage } from '../lib/storage';
import { useTheme } from '../contexts/ThemeContext';
import { getNextDueDate, formatDueIn, formatLastCompleted, isOverdue } from '../utils/taskUtils';

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onTaskUpdated: () => void;
}

export default function TaskDetails({
  task,
  onClose,
  onTaskUpdated,
}: TaskDetailsProps) {
  const { theme } = useTheme();
  const [currentTask, setCurrentTask] = useState<Task>(task);

  useEffect(() => {
    loadTask();
  }, [task.id]);

  const loadTask = async () => {
    const updated = await taskStorage.getTask(task.id);
    if (updated) {
      setCurrentTask(updated);
    }
  };

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
            await taskStorage.deleteCompletionDate(currentTask.id, date);
            await loadTask();
            onTaskUpdated();
          },
        },
      ]
    );
  };

  const formatCompletionDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const nextDue = getNextDueDate(currentTask);
  const overdue = isOverdue(currentTask);
  const dueInText = formatDueIn(nextDue);
  const lastCompletedText = formatLastCompleted(currentTask);
  const completedDates = [...(currentTask.completedDates || [])].sort(
    (a, b) => b - a
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: theme.surface, borderBottomColor: theme.border },
        ]}
      >
        <TouchableOpacity onPress={onClose}>
          <Text style={[styles.closeButton, { color: theme.text }]}>Close</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Task Details
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.taskTitle, { color: theme.text }]}>
            {currentTask.title}
          </Text>
          {currentTask.details && (
            <Text style={[styles.details, { color: theme.textSecondary }]}>
              {currentTask.details}
            </Text>
          )}
          <View style={styles.metadata}>
            <Text
              style={[
                styles.dueIn,
                {
                  color: overdue ? theme.error : theme.textSecondary,
                },
                overdue && styles.dueInOverdue,
              ]}
            >
              {dueInText}
            </Text>
            <Text style={[styles.lastCompleted, { color: theme.textTertiary }]}>
              {lastCompletedText}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Completion History
          </Text>
          {completedDates.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.textTertiary }]}>
              No completions yet
            </Text>
          ) : (
            <FlatList
              data={completedDates}
              scrollEnabled={false}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.completionItem,
                    { borderBottomColor: theme.borderLight },
                  ]}
                >
                  <Text style={[styles.completionDate, { color: theme.text }]}>
                    {formatCompletionDate(item)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteCompletion(item)}
                    style={styles.deleteCompletionButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text
                      style={[styles.deleteCompletionText, { color: theme.error }]}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerSpacer: {
    width: 50,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  details: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  metadata: {
    gap: 6,
  },
  dueIn: {
    fontSize: 16,
    fontWeight: '400',
  },
  dueInOverdue: {
    fontWeight: '500',
  },
  lastCompleted: {
    fontSize: 14,
    fontWeight: '400',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  completionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  completionDate: {
    fontSize: 15,
    fontWeight: '400',
  },
  deleteCompletionButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteCompletionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

