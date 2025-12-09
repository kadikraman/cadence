import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import TaskDetails from '../../components/TaskDetails';
import TaskForm from '../../components/TaskForm';
import TaskItem from '../../components/TaskItem';
import { useTheme } from '../../contexts/ThemeContext';
import { WidgetProvider } from '../../contexts/WidgetContext';
import { Task, taskStorage } from '../../lib/storage';
import { sortTasksByDueDate } from '../../utils/taskUtils';

function HomeContent({
  tasks,
  onTasksChange,
}: {
  tasks: Task[];
  onTasksChange: () => Promise<void>;
}) {
  const { theme } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const insets = useSafeAreaInsets();
  const confettiRef = useRef<ConfettiCannon>(null);

  const celebrateCompletion = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    confettiRef.current?.start();
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSaveTask = async (task: Task) => {
    await taskStorage.saveTask(task);
    await onTasksChange();
    setShowForm(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (task: Task) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await taskStorage.deleteTask(task.id);
            await onTasksChange();
          },
        },
      ]
    );
  };

  const handleToggleComplete = async (task: Task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const { getNextDueDate } = await import('../../utils/taskUtils');
    const nextDue = getNextDueDate(task);
    const nextDueDate = new Date(nextDue);
    nextDueDate.setHours(0, 0, 0, 0);
    const nextDueTimestamp = nextDueDate.getTime();

    const diffDays = Math.floor(
      (nextDueTimestamp - todayTimestamp) / (1000 * 60 * 60 * 24)
    );

    if (diffDays > 0) {
      Alert.alert(
        'Confirm Completion',
        `This task is not due for another ${diffDays} day${diffDays === 1 ? '' : 's'}. Are you sure?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Mark as Done',
            onPress: async () => {
              await taskStorage.markTaskCompleted(task.id);
              await onTasksChange();
              celebrateCompletion();
            },
          },
        ]
      );
    } else {
      await taskStorage.markTaskCompleted(task.id);
      await onTasksChange();
      celebrateCompletion();
    }
  };

  if (showForm) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      </SafeAreaView>
    );
  }

  if (viewingTask) {
    return (
      <TaskDetails
        task={viewingTask}
        onClose={() => setViewingTask(null)}
        onTaskUpdated={onTasksChange}
      />
    );
  }

  const screenWidth = Dimensions.get('window').width;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top },
      ]}
    >
      <View style={[styles.header]}>
        <Text style={[styles.title, { color: theme.text }]}>Tasks</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={[styles.addButtonText, { color: theme.text }]}>
            + Add Task
          </Text>
        </TouchableOpacity>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: theme.textTertiary }]}>
            No tasks yet. Add your first task to get started!
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onMarkDone={() => handleToggleComplete(item)}
              onEdit={() => handleEditTask(item)}
              onDelete={() => handleDeleteTask(item)}
              onViewDetails={() => setViewingTask(item)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: screenWidth / 2, y: -20 }}
        fadeOut
        autoStart={false}
      />
    </View>
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
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  list: {
    padding: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    const allTasks = await taskStorage.getAllTasks();
    const sorted = sortTasksByDueDate(allTasks);
    setTasks(sorted);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <WidgetProvider tasks={tasks}>
      <HomeContent tasks={tasks} onTasksChange={loadTasks} />
    </WidgetProvider>
  );
}
