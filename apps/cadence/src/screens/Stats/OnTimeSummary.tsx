import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { completionStatusColor } from '../../utils/colorUtils';
import { RangeStats } from '../../utils/statsUtils';

export default function OnTimeSummary({ stats }: { stats: RangeStats }) {
  const { theme } = useUnistyles();
  const n = stats.graded.length;
  const dense = n > 70;

  return (
    <View>
      <View style={styles.headline}>
        <Text style={styles.pct}>{stats.pct}%</Text>
        <Text style={styles.pctLabel}>on time</Text>
      </View>
      <View style={[styles.bar, { gap: dense ? 0 : 2 }]}>
        {n === 0 ? (
          <View style={[styles.segment, styles.emptySegment]} />
        ) : (
          stats.graded.map((status, i) => (
            <View
              key={i}
              style={[
                styles.segment,
                {
                  borderRadius: dense ? 0 : 2,
                  backgroundColor: completionStatusColor(status, theme.colors),
                },
              ]}
            />
          ))
        )}
      </View>
      <Text style={styles.caption}>
        {stats.completions === 0
          ? 'No completions in this range'
          : `${stats.onTime} on time · ${stats.late} late · ${stats.completions} completions, oldest to newest`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  headline: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  pct: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1.2,
    color: theme.colors.text,
  },
  pctLabel: {
    fontSize: 17,
    color: theme.colors.label2,
  },
  bar: {
    flexDirection: 'row',
    height: 10,
    marginTop: 10,
    borderRadius: 3,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
  },
  emptySegment: {
    backgroundColor: theme.colors.fill3,
  },
  caption: {
    fontSize: 13,
    color: theme.colors.label3,
    marginTop: 8,
  },
}));
