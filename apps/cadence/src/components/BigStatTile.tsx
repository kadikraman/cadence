import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface BigStatTileProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}

export default function BigStatTile({
  label,
  value,
  sub,
  accent,
}: BigStatTileProps) {
  const { theme } = useUnistyles();
  return (
    <View style={styles.tile}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: accent ?? theme.colors.text }]}>
        {value}
      </Text>
      {sub && <Text style={styles.sub}>{sub}</Text>}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  tile: {
    flex: 1,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    fontSize: 12,
    color: theme.colors.label3,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.8,
    lineHeight: 36,
    marginTop: 4,
  },
  sub: {
    fontSize: 12,
    color: theme.colors.label3,
    marginTop: 3,
  },
}));
