import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { HeatmapResult } from '../utils/statsUtils';

interface HeatmapProps {
  data: HeatmapResult;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const HOURS = ['12a', '4a', '8a', '12p', '4p', '8p'];

export default function Heatmap({ data }: HeatmapProps) {
  const { theme, rt } = useUnistyles();
  const dark = rt.themeName === 'dark';

  const cellBg = (count: number) => {
    if (count === 0) return theme.colors.fill4;
    const intensity = count / data.max;
    const r = dark ? 10 : 0;
    const g = dark ? 132 : 122;
    const b = 255;
    return `rgba(${r},${g},${b},${0.2 + intensity * 0.8})`;
  };

  return (
    <View>
      <View style={styles.hourRow}>
        <View style={styles.corner} />
        {HOURS.map((h, i) => (
          <Text key={i} style={styles.hourLabel}>
            {h}
          </Text>
        ))}
      </View>
      {data.grid.map((row, r) => (
        <View key={r} style={styles.row}>
          <Text style={styles.dayLabel}>{DAYS[r]}</Text>
          {row.map((v, c) => {
            const intensity = v / data.max;
            return (
              <View
                key={c}
                style={[styles.cell, { backgroundColor: cellBg(v) }]}
              >
                {v > 0 && (
                  <Text
                    style={[
                      styles.cellText,
                      {
                        color: intensity > 0.5 ? '#fff' : theme.colors.label2,
                      },
                    ]}
                  >
                    {v}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  hourRow: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 3,
  },
  corner: {
    width: 18,
  },
  hourLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    color: theme.colors.label3,
  },
  row: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 3,
    alignItems: 'center',
  },
  dayLabel: {
    width: 18,
    fontSize: 11,
    color: theme.colors.label3,
    fontWeight: '600',
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 10,
    fontWeight: '600',
  },
}));
