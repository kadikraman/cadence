import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export interface MaterialTabOption<T extends string> {
  value: T;
  label: string;
}

interface MaterialTabsProps<T extends string> {
  value: T;
  options: MaterialTabOption<T>[];
  onChange: (value: T) => void;
}

export default function MaterialTabs<T extends string>({
  value,
  options,
  onChange,
}: MaterialTabsProps<T>) {
  const { theme } = useUnistyles();
  return (
    <View
      style={[styles.row, { borderBottomColor: theme.colors.outlineVariant }]}
    >
      {options.map(opt => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            android_ripple={{ color: theme.colors.fill2, borderless: false }}
            style={[
              styles.tab,
              {
                borderBottomColor: selected
                  ? theme.colors.primary
                  : 'transparent',
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: selected ? theme.colors.primary : theme.colors.label2,
                },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create(() => ({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 3,
    marginBottom: -1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
}));
