import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons/static';

export default function AllCaughtUp() {
  const { theme } = useUnistyles();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <View
        style={[
          styles.iconTile,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
      >
        <MaterialCommunityIcons
          name="check"
          size={28}
          color={theme.colors.onPrimaryContainer}
        />
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          All caught up
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.label2 }]}>
          Nothing due today. Come back tomorrow.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(() => ({
  card: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconTile: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.15,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    letterSpacing: 0.25,
  },
}));
