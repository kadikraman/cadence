import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import TaskForm from '../components/TaskForm';
import { Task, taskStorage } from '../lib/storage';

export default function NewTaskScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ taskId?: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTask = async () => {
      if (params.taskId) {
        const loadedTask = await taskStorage.getTask(params.taskId);
        setTask(loadedTask);
      }
      setLoading(false);
    };
    loadTask();
  }, [params.taskId]);

  const handleSave = async (savedTask: Task) => {
    await taskStorage.saveTask(savedTask);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return null;
  }

  return <TaskForm task={task} onSave={handleSave} onCancel={handleCancel} />;
}
