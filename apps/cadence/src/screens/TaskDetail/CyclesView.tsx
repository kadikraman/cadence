import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Task } from '../../lib/types';
import { cadenceDays, driftStatus } from '../../utils/statsUtils';
import { MS_DAY } from '../../utils/taskUtils';

interface CyclesViewProps {
  task: Task;
  completedDates: number[];
}

export default function CyclesView({ task, completedDates }: CyclesViewProps) {
  const { theme } = useUnistyles();
  const cadDays = cadenceDays(task.cadence);
  const sorted = [...completedDates].sort((a, b) => a - b);

  interface Cycle {
    from: number;
    to: number;
    delta: number;
    drift: number;
  }
  const cycles: Cycle[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const delta = (sorted[i] - sorted[i - 1]) / MS_DAY;
    cycles.push({
      from: sorted[i - 1],
      to: sorted[i],
      delta,
      drift: delta - cadDays,
    });
  }
  cycles.reverse();

  if (cycles.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          Complete at least twice to see cycle history.
        </Text>
      </View>
    );
  }

  const maxDelta = Math.max(cadDays * 2, ...cycles.map(c => c.delta));

  const colorFor = (cycle: Cycle) => {
    const status = driftStatus(cycle.delta, cadDays);
    if (status === 'late') return theme.colors.warning;
    if (status === 'early') return theme.colors.blue;
    return theme.colors.success;
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>
          <Text style={styles.headerStrong}>{cadDays}</Text> day cadence
        </Text>
        <View style={styles.legend}>
          <LegendDot color={theme.colors.success} label="on time" />
          <LegendDot color={theme.colors.warning} label="late" />
          <LegendDot color={theme.colors.blue} label="early" />
        </View>
      </View>
      <View style={styles.list}>
        {cycles.map((cy, i) => {
          const onTimePct = Math.min(1, cadDays / maxDelta);
          const fillPct = Math.min(1, cy.delta / maxDelta);
          const color = colorFor(cy);
          const fromLabel = new Date(cy.from).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          const toLabel = new Date(cy.to).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          const driftLabel =
            cy.drift > cadDays * 0.1
              ? `(+${Math.round(cy.drift)})`
              : cy.drift < -cadDays * 0.1
                ? `(${Math.round(cy.drift)})`
                : '';
          return (
            <View key={i}>
              <View style={styles.labelRow}>
                <Text style={styles.range}>
                  {fromLabel} → {toLabel}
                </Text>
                <Text style={[styles.delta, { color }]}>
                  {Math.round(cy.delta)}d {driftLabel}
                </Text>
              </View>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { width: `${fillPct * 100}%`, backgroundColor: color },
                  ]}
                />
                <View
                  style={[
                    styles.marker,
                    {
                      left: `${onTimePct * 100}%`,
                      backgroundColor: theme.colors.label2,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={legendStyles.item}>
      <View style={[legendStyles.dot, { backgroundColor: color }]} />
      <Text style={legendStyles.text}>{label}</Text>
    </View>
  );
}

const legendStyles = StyleSheet.create(theme => ({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    color: theme.colors.label3,
  },
}));

const styles = StyleSheet.create(theme => ({
  card: {
    marginHorizontal: 16,
    marginTop: 4,
    padding: 14,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 14,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  emptyText: {
    color: theme.colors.label3,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.sepSubtle,
  },
  headerText: {
    fontSize: 13,
    color: theme.colors.label3,
  },
  headerStrong: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    gap: 10,
  },
  list: {
    gap: 11,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  range: {
    fontSize: 12,
    color: theme.colors.label3,
  },
  delta: {
    fontSize: 12,
    fontWeight: '600',
  },
  track: {
    position: 'relative',
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.fill4,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 3,
  },
  marker: {
    position: 'absolute',
    top: -2,
    bottom: -2,
    width: 1.5,
    opacity: 0.5,
  },
}));
