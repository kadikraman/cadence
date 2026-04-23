import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { CadenceMix } from '../utils/statsUtils';

interface CadenceMixBarProps {
  mix: CadenceMix;
}

const PURPLE = '#AF52DE';

export default function CadenceMixBar({ mix }: CadenceMixBarProps) {
  const { theme } = useUnistyles();
  const total = mix.total;

  const segments = [
    {
      key: 'daily',
      label: 'Daily',
      count: mix.daily,
      color: theme.colors.blue,
    },
    {
      key: 'weekly',
      label: 'Weekly',
      count: mix.weekly,
      color: theme.colors.success,
    },
    {
      key: 'monthly',
      label: 'Monthly',
      count: mix.monthly,
      color: theme.colors.warning,
    },
    { key: 'custom', label: 'Custom', count: mix.custom, color: PURPLE },
  ].filter(s => s.count > 0);

  return (
    <View>
      <View style={[styles.bar, { backgroundColor: theme.colors.fill4 }]}>
        {segments.map((s, i) => (
          <View
            key={s.key}
            style={{
              flex: s.count,
              backgroundColor: s.color,
              marginLeft: i === 0 ? 0 : 2,
            }}
          />
        ))}
      </View>
      <View style={styles.legend}>
        {segments.map(s => (
          <View key={s.key} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {s.label}
            </Text>
            <Text style={[styles.count, { color: theme.colors.label3 }]}>
              {s.count}
            </Text>
          </View>
        ))}
      </View>
      <Text style={[styles.total, { color: theme.colors.label3 }]}>
        {total} {total === 1 ? 'task' : 'tasks'} total
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 12,
    borderRadius: 6,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  count: {
    fontSize: 13,
    fontWeight: '500',
  },
  total: {
    fontSize: 12,
    marginTop: 10,
  },
});
