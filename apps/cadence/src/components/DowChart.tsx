import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface DowChartProps {
  counts: number[];
}

const DOW_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function DowChart({ counts }: DowChartProps) {
  const { theme } = useUnistyles();
  const max = Math.max(1, ...counts);
  const peak = counts.indexOf(Math.max(...counts));

  return (
    <View>
      <View style={styles.chart}>
        {counts.map((c, i) => {
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
        {DOW_LABELS.map((d, i) => (
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
