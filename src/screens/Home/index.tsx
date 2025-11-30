import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { taskStorage, Task } from '../../lib/storage';
import TaskItem from '../../components/TaskItem';
import TaskForm from '../../components/TaskForm';
import { sortTasksByDueDate } from '../../utils/taskUtils';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const allTasks = await taskStorage.getAllTasks();
    const sorted = sortTasksByDueDate(allTasks);
    setTasks(sorted);
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
    await loadTasks();
    setShowForm(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (id: string) => {
    await taskStorage.deleteTask(id);
    await loadTasks();
  };

  const handleToggleComplete = async (task: Task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const isCompletedToday = task.completedDates?.some(
      (date) => new Date(date).setHours(0, 0, 0, 0) === todayTimestamp
    );

    if (isCompletedToday) {
      await taskStorage.unmarkTaskCompleted(task.id, todayTimestamp);
    } else {
      await taskStorage.markTaskCompleted(task.id, todayTimestamp);
    }
    await loadTasks();
  };

  if (showForm) {
    return (
      <SafeAreaView style={styles.container}>
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

  return (
    <SafeAreaView style={styles.container}>
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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onMarkDone={() => handleToggleComplete(item)}
              onEdit={() => handleEditTask(item)}
              onDelete={() => handleDeleteTask(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.5,
  },
  addButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  list: {
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

