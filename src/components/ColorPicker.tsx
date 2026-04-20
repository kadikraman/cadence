import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { COLOR_KEYS, ColorKey, TINTS } from '../utils/taskTints';

interface ColorPickerProps {
  value: ColorKey;
  onChange: (value: ColorKey) => void;
}

const ROW = 10;

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const { theme } = useUnistyles();
  const rows: ColorKey[][] = [];
  for (let i = 0; i < COLOR_KEYS.length; i += ROW) {
    rows.push(COLOR_KEYS.slice(i, i + ROW));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map(key => {
            const selected = value === key;
            return (
              <Pressable
                key={key}
                onPress={() => onChange(key)}
                style={styles.cell}
                accessibilityRole="button"
                accessibilityLabel={key}
              >
                <View
                  style={[
                    styles.swatch,
                    { backgroundColor: TINTS[key].accent },
                    selected && {
                      borderWidth: 2.5,
                      borderColor: theme.colors.text,
                    },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create(() => ({
  grid: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
}));
