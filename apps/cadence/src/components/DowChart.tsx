import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useSettingsStore } from '../stores/settings';

interface DowChartProps {
  counts: number[];
}

const DOW_LABELS_SUN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DOW_LABELS_MON = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function DowChart({ counts }: DowChartProps) {
  const { theme } = useUnistyles();
  const weekStartsOnMonday = useSettingsStore(s => s.weekStartsOnMonday);
  const labels = weekStartsOnMonday ? DOW_LABELS_MON : DOW_LABELS_SUN;
  const ordered = weekStartsOnMonday ? [...counts.slice(1), counts[0]] : counts;
  const max = Math.max(1, ...ordered);
  const peak = ordered.indexOf(Math.max(...ordered));

  return (
    <View>
      <View style={styles.chart}>
        {ordered.map((c, i) => {
          const h = (c / max) * 100;
          const isPeak = c > 0 && i === peak;
          return (
            <View key={i} style={styles.col}>
              <Text style={[styles.count, { color: theme.colors.label3 }]}>
                {c || ''}
              </Text>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${h}%`,
                    minHeight: c > 0 ? 4 : 1,
                    backgroundColor: isPeak
                      ? theme.colors.blue
                      : c > 0
                        ? theme.colors.blue + '66'
                        : theme.colors.fill4,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
      <View style={styles.axis}>
        {labels.map((d, i) => (
          <Text key={i} style={[styles.dow, { color: theme.colors.label3 }]}>
            {d}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    gap: 6,
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
    fontWeight: '600',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  axis: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  dow: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
  },
});
