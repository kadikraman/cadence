import type { SFSymbol } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import UiSymbol from '../ui/UiSymbol';

interface DayOptionRowProps {
  label: string;
  detail?: string;
  selected?: boolean;
  current?: boolean;
  link?: boolean;
  trailingSymbol?: SFSymbol;
  onPress: () => void;
}

export default function DayOptionRow({
  label,
  detail,
  selected = false,
  current = false,
  link = false,
  trailingSymbol,
  onPress,
}: DayOptionRowProps) {
  const { theme } = useUnistyles();
  return (
    <Pressable
      onPress={onPress}
      disabled={current}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: current }}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Text
        style={[
          styles.label,
          selected && styles.labelSelected,
          current && styles.labelCurrent,
          link && styles.labelLink,
        ]}
      >
        {label}
      </Text>
      {detail && <Text style={styles.detail}>{detail}</Text>}
      <View style={styles.trailing}>
        {selected ? (
          <UiSymbol name="checkmark" size={17} color={theme.colors.blue} />
        ) : (
          trailingSymbol && (
            <UiSymbol
              name={trailingSymbol}
              size={14}
              color={theme.colors.label4}
            />
          )
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create(theme => ({
  row: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  rowPressed: {
    backgroundColor: theme.colors.fill4,
  },
  label: {
    flex: 1,
    fontSize: 17,
    color: theme.colors.text,
    letterSpacing: -0.4,
  },
  labelSelected: {
    fontWeight: '600',
  },
  labelCurrent: {
    color: theme.colors.label3,
  },
  labelLink: {
    color: theme.colors.blue,
  },
  detail: {
    fontSize: 15,
    color: theme.colors.label3,
  },
  trailing: {
    width: 20,
    alignItems: 'center',
  },
}));
