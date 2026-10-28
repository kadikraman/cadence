import { Platform, Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import TaskTile from '../../components/ui/TaskTile';
import { Task } from '../../lib/types';
import { completionStatusColor, withAlpha } from '../../utils/colorUtils';
import { TaskLane as TaskLaneData } from '../../utils/statsUtils';
import { MS_DAY } from '../../utils/taskUtils';
import { Tick } from './helpers';

interface TaskLaneProps {
  lane: TaskLaneData;
  start: number;
  end: number;
  rangeDays: number;
  ticks: Tick[];
  onPress: (task: Task) => void;
}

const TRACK_HEIGHT = 16;

export default function TaskLane({
  lane,
  start,
  end,
  rangeDays,
  ticks,
  onPress,
}: TaskLaneProps) {
  const { theme } = useUnistyles();
  const span = end - start;
  const pos = (ts: number) =>
    Math.max(0, Math.min(1, (ts - start) / span)) * 100;
  const dayMid = (ts: number) => ts + MS_DAY / 2;

  const dot = rangeDays <= 30 ? 9 : rangeDays <= 90 ? 7 : 4;
  const ring = rangeDays <= 90 ? 1.5 : 0;
  const outer = dot + ring * 2;
  const ringColor = Platform.select({
    android: theme.colors.surface,
    default: theme.colors.surfaceElevated,
  });

  const bands = lane.lateSpans.map(s => ({
    from: Math.max(s.dueAt, start),
    to: dayMid(s.completedAt),
    now: false,
  }));
  if (lane.overdueDays > 0) {
    bands.push({ from: Math.max(lane.nextDue, start), to: end, now: true });
  }

  let meta: string;
  let metaColor = theme.colors.label2;
  if (lane.overdueDays > 0) {
    meta = `${lane.overdueDays}d overdue`;
    metaColor = theme.colors.error;
  } else if (lane.pct === null) {
    meta =
      lane.completions.length > 0
        ? `${lane.completions.length} done`
        : 'not due';
    metaColor = theme.colors.label3;
  } else {
    meta = `${lane.pct}%`;
    if (lane.pct < 80) metaColor = theme.colors.warning;
  }

  return (
    <Pressable onPress={() => onPress(lane.task)}>
      <View style={styles.header}>
        <TaskTile task={lane.task} size={24} />
        <Text style={styles.title} numberOfLines={1}>
          {lane.task.title}
        </Text>
        <Text style={[styles.meta, { color: metaColor }]}>{meta}</Text>
      </View>
      <View style={styles.track}>
        <View style={styles.rail} />
        {ticks.map(k => (
          <View
            key={k.line}
            style={[styles.tick, { left: `${pos(k.line)}%` }]}
          />
        ))}
        {bands.map((b, i) => (
          <View
            key={i}
            style={[
              styles.band,
              {
                left: `${pos(b.from)}%`,
                width: `${Math.max(0.8, pos(b.to) - pos(b.from))}%`,
                backgroundColor: withAlpha(
                  b.now ? theme.colors.error : theme.colors.warning,
                  0.24
                ),
              },
            ]}
          />
        ))}
        {lane.overdueDays > 0 && <View style={styles.overdueCap} />}
        {lane.completions.map(c => (
          <View
            key={c.completedAt}
            style={{
              position: 'absolute',
              left: `${pos(dayMid(c.completedAt))}%`,
              marginLeft: -outer / 2,
              top: TRACK_HEIGHT / 2 - outer / 2,
              width: outer,
              height: outer,
              borderRadius: outer / 2,
              borderWidth: ring,
              borderColor: ringColor,
              backgroundColor: completionStatusColor(c.status, theme.colors),
            }}
          />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create(theme => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: -0.2,
    color: theme.colors.text,
  },
  meta: {
    fontSize: 13,
    fontWeight: '600',
  },
  track: {
    height: TRACK_HEIGHT,
    marginTop: 6,
  },
  rail: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 7,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.fill2,
  },
  tick: {
    position: 'absolute',
    top: 3,
    height: 10,
    width: 1,
    backgroundColor: theme.colors.fill1,
  },
  band: {
    position: 'absolute',
    top: 3,
    height: 10,
    borderRadius: 5,
  },
  overdueCap: {
    position: 'absolute',
    right: -1,
    top: 3,
    width: 3,
    height: 10,
    borderRadius: 2,
    backgroundColor: theme.colors.error,
  },
}));
