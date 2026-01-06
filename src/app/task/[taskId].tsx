import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import TaskDetails from '../../components/TaskDetails';
import { Task, taskStorage } from '../../lib/storage';

export default function TaskDetailsScreen() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTask = useCallback(async () => {
    if (taskId) {
      const loadedTask = await taskStorage.getTask(taskId);
      setTask(loadedTask);
    }
    setLoading(false);
  }, [taskId]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  useFocusEffect(
    useCallback(() => {
      if (taskId) {
        loadTask();
      }
    }, [taskId, loadTask])
  );

  const handleClose = () => {
    router.back();
  };

  const handleTaskUpdated = async () => {
    if (taskId) {
      const updatedTask = await taskStorage.getTask(taskId);
      setTask(updatedTask);
    }
  };

  const handleEdit = () => {
    router.push(`/new?taskId=${taskId}`);
  };

  if (loading || !task) {
    return null;
  }

  return (
    <TaskDetails
      task={task}
      onClose={handleClose}
      onTaskUpdated={handleTaskUpdated}
      onEdit={handleEdit}
    />
  );
}
