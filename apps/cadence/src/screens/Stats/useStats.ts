import { useMemo, useState } from 'react';
import { useTasksStore } from '../../stores/tasks';
import {
  computeAvgLateDrift,
  computeCadenceMix,
  computeDowCounts,
  computeLongestStreak,
  computeMostReliable,
  computeOnTimePct,
  computeWeeklyCompletions,
  taskHealth,
} from '../../utils/statsUtils';

export type Range = '7' | '30' | '90' | '365';

export function useStats() {
  const tasks = useTasksStore(s => s.tasks);
  const [range, setRange] = useState<Range>('30');
  const rangeDays = parseInt(range);

  const overall = useMemo(() => {
    const { onTime, late, pct } = computeOnTimePct(tasks, rangeDays);
    const cutoff = Date.now() - rangeDays * 86400000;
    let completions = 0;
    for (const t of tasks) {
      for (const d of t.completedDates ?? []) {
        if (d >= cutoff) completions++;
      }
    }
    return { onTime, late, pct, completions };
  }, [tasks, rangeDays]);

  const weekly = useMemo(() => computeWeeklyCompletions(tasks, 12), [tasks]);
  const longestStreak = useMemo(() => computeLongestStreak(tasks), [tasks]);
  const avgLateDrift = useMemo(
    () => computeAvgLateDrift(tasks, rangeDays),
    [tasks, rangeDays]
  );
  const mostReliable = useMemo(
    () => computeMostReliable(tasks, rangeDays),
    [tasks, rangeDays]
  );
  const dowCounts = useMemo(
    () => computeDowCounts(tasks, rangeDays),
    [tasks, rangeDays]
  );
  const cadenceMix = useMemo(() => computeCadenceMix(tasks), [tasks]);

  const hallOfShame = useMemo(() => {
    return [...tasks]
      .map(t => ({ t, h: taskHealth(t) }))
      .filter(x => x.h > 1)
      .sort((a, b) => b.h - a.h)
      .slice(0, 4);
  }, [tasks]);

  return {
    range,
    setRange,
    rangeDays,
    overall,
    weekly,
    longestStreak,
    avgLateDrift,
    mostReliable,
    dowCounts,
    cadenceMix,
    hallOfShame,
  };
}
