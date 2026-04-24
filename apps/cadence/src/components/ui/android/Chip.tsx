import { Pressable, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface ChipProps {
  label: string;
  selected?: boolean;
  error?: boolean;
  onPress: () => void;
}

export default function Chip({
  label,
  selected = false,
  error = false,
  onPress,
}: ChipProps) {
  const { theme } = useUnistyles();

  const backgroundColor = selected
    ? error
      ? theme.colors.errorContainer
      : theme.colors.secondaryContainer
    : 'transparent';
  const color = selected
    ? error
      ? theme.colors.onErrorContainer
      : theme.colors.onSecondaryContainer
    : theme.colors.label2;
  const borderColor = selected ? 'transparent' : theme.colors.outline;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      android_ripple={{ color: theme.colors.fill2, borderless: false }}
      style={[
        styles.chip,
        { backgroundColor, borderColor, borderWidth: selected ? 0 : 1 },
      ]}
    >
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create(() => ({
  chip: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
}));
