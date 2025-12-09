import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Task, taskStorage } from '../lib/storage';
import {
  formatDueIn,
  formatLastCompleted,
  getNextDueDate,
  isOverdue,
} from '../utils/taskUtils';

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
  const { theme } = useTheme();

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

  const nextDue = getNextDueDate(task);
  const overdue = isOverdue(task);
  const dueInText = formatDueIn(nextDue);
  const lastCompletedText = formatLastCompleted(task);
  const completedDates = [...(task.completedDates || [])].sort((a, b) => b - a);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onClose}>
          <Text style={[styles.closeButton, { color: theme.text }]}>Close</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Task Details
        </Text>
        <TouchableOpacity onPress={onEdit}>
          <Text style={[styles.editButton, { color: theme.text }]}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.section]}>
          <Text style={[styles.taskTitle, { color: theme.text }]}>
            {task.title}
          </Text>
          {task.details && (
            <Text style={[styles.details, { color: theme.textSecondary }]}>
              {task.details}
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

        <View style={[styles.section]}>
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
              keyExtractor={item => item.toString()}
              renderItem={({ item }) => (
                <View style={[styles.completionItem]}>
                  <Text style={[styles.completionDate, { color: theme.text }]}>
                    {formatCompletionDate(item)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteCompletion(item)}
                    style={styles.deleteCompletionButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text
                      style={[
                        styles.deleteCompletionText,
                        { color: theme.error },
                      ]}
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
  editButton: {
    fontSize: 16,
    fontWeight: '600',
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
