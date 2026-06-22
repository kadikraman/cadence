import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { routes } from '../../lib/routes';
import { Task } from '../../lib/types';
import { useTasksStore } from '../../stores/tasks';

export function useArchived() {
  const router = useRouter();
  const tasks = useTasksStore(s => s.tasks);

  const archived = useMemo(
    () =>
      tasks
        .filter(t => t.archived)
        .sort((a, b) => (b.lastCompletedAt ?? 0) - (a.lastCompletedAt ?? 0)),
    [tasks]
  );

  const openTask = useCallback(
    (task: Task) => router.push(routes.taskDetail(task.id)),
    [router]
  );

  return { router, archived, openTask };
}
