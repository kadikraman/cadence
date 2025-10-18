import { SymbolView } from 'expo-symbols';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';
import { db, Task } from '../lib/db';
import { TaskFormData } from '../utils/taskUtils';

export default function Home() {
  const user = db.useUser();
  const { tasks, isLoading, createTask, completeTask, updateTask, deleteTask } =
    useTasks();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleSignOut = async () => {
    try {
      await db.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleCreateTask = async (taskData: TaskFormData) => {
    await createTask(taskData);
  };

  const handleEditTask = async (taskData: TaskFormData) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
    }
  };

  const handleCompleteTask = async (task: Task) => {
    await completeTask(task);
  };

  const handleEditTaskClick = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (task: Task) => {
    await deleteTask(task.id);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const getInitialFormData = (): Partial<TaskFormData> | undefined => {
    if (!editingTask) return undefined;

    return {
      name: editingTask.name,
      description: editingTask.description || undefined,
      cadenceType: editingTask.cadenceType as any,
      cadenceInterval: editingTask.cadenceInterval,
      nextDueDate: new Date(editingTask.nextDueDate),
    };
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <SymbolView
            name="clock"
            style={styles.loadingIcon}
            tintColor="#007AFF"
            type="hierarchical"
          />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.titleContainer}>
            <SymbolView
              name="checkmark.circle.fill"
              style={styles.appIcon}
              tintColor="#007AFF"
              type="hierarchical"
            />
            <View>
              <Text style={styles.title}>Cadence</Text>
              <Text style={styles.subtitle}>{user.email}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <SymbolView
            name="rectangle.portrait.and.arrow.right"
            style={styles.signOutIcon}
            tintColor="white"
            type="monochrome"
          />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowTaskForm(true)}
          >
            <SymbolView
              name="plus.circle.fill"
              style={styles.addButtonIcon}
              tintColor="white"
              type="monochrome"
            />
            <Text style={styles.addButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>

        <TaskList
          tasks={tasks}
          onComplete={handleCompleteTask}
          onEdit={handleEditTaskClick}
          onDelete={handleDeleteTask}
        />
      </View>

      <TaskForm
        visible={showTaskForm}
        onClose={handleCloseTaskForm}
        onSubmit={editingTask ? handleEditTask : handleCreateTask}
        initialData={getInitialFormData()}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingIcon: {
    width: 32,
    height: 32,
  },
  loadingText: {
    fontSize: 17,
    color: '#8E8E93',
    fontWeight: '400',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C6C6C8',
  },
  headerLeft: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appIcon: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1D1D1F',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 2,
    fontWeight: '400',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FF3B30',
    gap: 6,
  },
  signOutIcon: {
    width: 16,
    height: 16,
  },
  signOutText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  addButtonContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C6C6C8',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 18,
    gap: 8,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonIcon: {
    width: 20,
    height: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
});
