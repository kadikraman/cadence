import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import UiSymbol from '../../components/ui/UiSymbol';
import { TaskStats } from '../../utils/statsUtils';

export default function StatTrio({ stats }: { stats: TaskStats }) {
  const { theme } = useUnistyles();
  const items = [
    {
      value: stats.onTime + stats.late > 0 ? `${stats.onTimePct}%` : '–',
      label: 'on time',
      flame: false,
    },
    { value: String(stats.streak), label: 'in a row', flame: true },
    { value: String(stats.total), label: 'done', flame: false },
  ];

  return (
    <View style={styles.row}>
      {items.map((it, i) => (
        <View key={it.label} style={[styles.item, i > 0 && styles.divider]}>
          <View style={styles.valueRow}>
            {it.flame && (
              <UiSymbol
                name="flame.fill"
                size={16}
                color={theme.colors.warning}
              />
            )}
            <Text style={styles.value}>{it.value}</Text>
          </View>
          <Text style={styles.label}>{it.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  row: {
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    borderLeftWidth: 0.5,
    borderLeftColor: theme.colors.sep,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: theme.colors.text,
  },
  label: {
    fontSize: 12,
    color: theme.colors.label3,
    marginTop: 2,
  },
}));
