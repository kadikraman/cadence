import { SymbolView } from 'expo-symbols';
import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { GLYPH_KEYS, GlyphKey, GLYPHS } from '../utils/glyphs';
import { ColorKey, getTint } from '../utils/taskTints';

interface GlyphPickerProps {
  value: GlyphKey;
  color: ColorKey;
  onChange: (value: GlyphKey) => void;
}

const ROW = 8;

export default function GlyphPicker({
  value,
  color,
  onChange,
}: GlyphPickerProps) {
  const { theme } = useUnistyles();
  const accent = getTint(color).accent;
  const rows: GlyphKey[][] = [];
  for (let i = 0; i < GLYPH_KEYS.length; i += ROW) {
    rows.push(GLYPH_KEYS.slice(i, i + ROW));
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
                style={[
                  styles.cell,
                  {
                    backgroundColor: selected ? accent : theme.colors.fill3,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={key}
              >
                <SymbolView
                  name={GLYPHS[key]}
                  size={18}
                  tintColor={selected ? '#fff' : theme.colors.label2}
                  resizeMode="scaleAspectFit"
                  fallback={null}
                />
              </Pressable>
            );
          })}
          {row.length < ROW &&
            Array.from({ length: ROW - row.length }).map((_, i) => (
              <View key={`pad-${i}`} style={styles.cell} />
            ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create(() => ({
  grid: {
    padding: 12,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
