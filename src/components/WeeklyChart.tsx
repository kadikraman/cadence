import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { WeekBucket } from '../utils/statsUtils';

interface WeeklyChartProps {
  weekly: WeekBucket[];
}

export default function WeeklyChart({ weekly }: WeeklyChartProps) {
  const { theme } = useUnistyles();
  const max = Math.max(1, ...weekly.map(w => w.count));
  const firstLabel = weekly.length
    ? new Date(weekly[0].end).toLocaleString('en-US', { month: 'short' })
    : '';

  return (
    <View>
      <View style={styles.chart}>
        {weekly.map((w, i) => {
          const h = (w.count / max) * 100;
          return (
            <View key={i} style={styles.col}>
              <Text style={styles.count}>{w.count || ''}</Text>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${h}%`,
                    minHeight: w.count > 0 ? 4 : 1,
                    backgroundColor:
                      w.count > 0 ? theme.colors.blue : theme.colors.fill4,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
      <View style={styles.axis}>
        <Text style={styles.axisLabel}>{firstLabel}</Text>
        <Text style={styles.axisLabel}>this week</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  chart: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'flex-end',
    height: 100,
    paddingTop: 18,
  },
  col: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    height: '100%',
    justifyContent: 'flex-end',
  },
  count: {
    fontSize: 10,
    color: theme.colors.label3,
    fontWeight: '600',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  axis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 2,
  },
  axisLabel: {
    fontSize: 10,
    color: theme.colors.label3,
  },
}));
