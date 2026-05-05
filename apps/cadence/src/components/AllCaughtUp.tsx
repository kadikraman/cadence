import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export default function AllCaughtUp() {
  const { rt } = useUnistyles();
  const dark = rt.themeName === 'dark';

  const gradient = dark
    ? (['#3C2E5A', '#2A1F42'] as const)
    : (['#EFE7FF', '#F6F0FF'] as const);

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.card}
    >
      <View style={styles.iconTile}>
        <SymbolView
          name="checkmark"
          size={26}
          tintColor={dark ? '#C4B1FF' : '#6B4BD6'}
          resizeMode="scaleAspectFit"
          fallback={null}
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>All caught up</Text>
        <Text style={styles.subtitle}>
          Nothing due today. Come back tomorrow.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create(theme => ({
  card: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconTile: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.label2,
    marginTop: 2,
  },
}));
