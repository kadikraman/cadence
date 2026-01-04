import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { StyleSheet } from 'react-native-unistyles';
import TaskItem from '../../components/TaskItem';
import { WidgetProvider } from '../../contexts/WidgetContext';
import { Task, taskStorage } from '../../lib/storage';
import {
  getNextDueDate,
  isCompletedToday,
  isDueToday,
  isOverdue,
  sortTasksByDueDate,
} from '../../utils/taskUtils';

function HomeContent({
  tasks,
  onTasksChange,
}: {
  tasks: Task[];
  onTasksChange: () => Promise<void>;
}) {
  const router = useRouter();
  const confettiRef = useRef<ConfettiCannon>(null);

  const celebrateCompletion = () => {
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      confettiRef.current?.start();
    }, 200);
  };

  const isLastTaskDueToday = (allTasks: Task[]): boolean => {
    const remainingTasksDueToday = allTasks.filter(
      task => (isOverdue(task) || isDueToday(task)) && !isCompletedToday(task)
    );
    return remainingTasksDueToday.length === 0;
  };

  const handleAddTask = () => {
    router.push('/new');
  };

  const handleEditTask = (task: Task) => {
    router.push(`/new?taskId=${task.id}`);
  };

  const handleViewDetails = (task: Task) => {
    router.push(`/task/${task.id}`);
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
    if (isCompletedToday(task)) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime();

      const todayCompletionDate = task.completedDates?.find(date => {
        const completedDate = new Date(date);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === todayTimestamp;
      });

      if (todayCompletionDate) {
        await taskStorage.unmarkTaskCompleted(task.id, todayCompletionDate);
        await onTasksChange();
      }
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

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
              const updatedTasks = await taskStorage.getAllTasks();
              const sorted = sortTasksByDueDate(updatedTasks);
              if (isLastTaskDueToday(sorted)) {
                celebrateCompletion();
              }
              await onTasksChange();
            },
          },
        ]
      );
    } else {
      await taskStorage.markTaskCompleted(task.id);
      const updatedTasks = await taskStorage.getAllTasks();
      const sorted = sortTasksByDueDate(updatedTasks);
      if (isLastTaskDueToday(sorted)) {
        celebrateCompletion();
      }
      await onTasksChange();
    }
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </TouchableOpacity>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
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
              onViewDetails={() => handleViewDetails(item)}
            />
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: rt.insets.top,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 8,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: theme.colors.text,
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
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
    color: theme.colors.textTertiary,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
}));

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

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  return (
    <WidgetProvider tasks={tasks}>
      <HomeContent tasks={tasks} onTasksChange={loadTasks} />
    </WidgetProvider>
  );
}
