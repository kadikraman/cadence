import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { routes } from '../../lib/routes';
import { Task } from '../../lib/types';
import { useTasksStore } from '../../stores/tasks';
import { computeRangeStats } from '../../utils/statsUtils';
import { addDays, getTodayTimestamp } from '../../utils/taskUtils';
import { rangeTicks } from './helpers';

export type Range = '7' | '30' | '90' | '365';

export function useStats() {
  const router = useRouter();
  const tasks = useTasksStore(s => s.tasks);
  const [range, setRange] = useState<Range>('30');
  const rangeDays = parseInt(range);

  const { start, end } = useMemo(() => {
    const today = getTodayTimestamp();
    return {
      start: addDays(today, -(rangeDays - 1)),
      end: addDays(today, 1),
    };
  }, [rangeDays]);

  const stats = useMemo(
    () => computeRangeStats(tasks, start, end),
    [tasks, start, end]
  );
  const ticks = useMemo(
    () => rangeTicks(start, end, rangeDays),
    [start, end, rangeDays]
  );

  const openTask = useCallback(
    (task: Task) => router.push(routes.taskDetail(task.id)),
    [router]
  );

  return {
    router,
    range,
    setRange,
    rangeDays,
    start,
    end,
    stats,
    ticks,
    openTask,
  };
}
