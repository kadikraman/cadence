import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Task } from '../../lib/types';
import { withAlpha } from '../../utils/colorUtils';
import { TaskLane as TaskLaneData } from '../../utils/statsUtils';
import { Tick } from './helpers';
import TaskLane from './TaskLane';

interface TaskLanesProps {
  lanes: TaskLaneData[];
  start: number;
  end: number;
  rangeDays: number;
  ticks: Tick[];
  onPressTask: (task: Task) => void;
}

const LABEL_WIDTH = 48;

export default function TaskLanes({
  lanes,
  start,
  end,
  rangeDays,
  ticks,
  onPressTask,
}: TaskLanesProps) {
  const { theme } = useUnistyles();

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.heading}>By task</Text>
        <Text style={styles.headingNote}>on time</Text>
      </View>
      <View style={styles.tickRow}>
        {ticks.map(k => {
          const x = ((k.at - start) / (end - start)) * 100;
          const align = x < 8 ? 'left' : x > 92 ? 'right' : 'center';
          const offset =
            align === 'left'
              ? 0
              : align === 'right'
                ? -LABEL_WIDTH
                : -LABEL_WIDTH / 2;
          return (
            <Text
              key={k.line}
              numberOfLines={1}
              style={[
                styles.tickLabel,
                { left: `${x}%`, marginLeft: offset, textAlign: align },
              ]}
            >
              {k.label}
            </Text>
          );
        })}
      </View>
      <View style={styles.lanes}>
        {lanes.map(lane => (
          <TaskLane
            key={lane.task.id}
            lane={lane}
            start={start}
            end={end}
            rangeDays={rangeDays}
            ticks={ticks}
            onPress={onPressTask}
          />
        ))}
      </View>
      <View style={styles.legend}>
        <LegendItem color={theme.colors.success} label="on time" />
        <LegendItem color={theme.colors.blue} label="early" />
        <LegendItem color={theme.colors.warning} label="late" />
        <LegendItem
          color={withAlpha(theme.colors.warning, 0.3)}
          label="was overdue"
          band
        />
        <LegendItem
          color={withAlpha(theme.colors.error, 0.3)}
          label="overdue now"
          band
        />
      </View>
    </View>
  );
}

function LegendItem({
  color,
  label,
  band,
}: {
  color: string;
  label: string;
  band?: boolean;
}) {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.swatch,
          { width: band ? 16 : 8, backgroundColor: color },
        ]}
      />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  heading: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  headingNote: {
    fontSize: 12,
    color: theme.colors.label3,
  },
  tickRow: {
    height: 14,
    marginTop: 10,
  },
  tickLabel: {
    position: 'absolute',
    width: LABEL_WIDTH,
    fontSize: 11,
    color: theme.colors.label3,
  },
  lanes: {
    gap: 14,
    marginTop: 10,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 14,
    rowGap: 6,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.sep,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  swatch: {
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: theme.colors.label3,
  },
}));
