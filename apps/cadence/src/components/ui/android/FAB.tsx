import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface FABProps {
  icon: string;
  label?: string;
  extended?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}

export default function FAB({
  icon,
  label,
  extended = false,
  onPress,
  accessibilityLabel,
}: FABProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        android_ripple={{
          color: theme.colors.fill2,
          borderless: false,
        }}
        style={[
          styles.fab,
          extended ? styles.extended : styles.compact,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={theme.colors.onPrimaryContainer}
        />
        {extended && label && (
          <Text
            style={[styles.label, { color: theme.colors.onPrimaryContainer }]}
          >
            {label}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create(() => ({
  wrapper: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  compact: {
    width: 56,
  },
  extended: {
    minWidth: 56,
    paddingHorizontal: 16,
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
}));
