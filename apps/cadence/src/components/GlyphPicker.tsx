import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getMaterialIcon,
  GlyphKey,
  GLYPHS,
  VISIBLE_GLYPH_KEYS,
} from '../utils/glyphs';
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
  const [query, setQuery] = useState('');

  const visibleKeys = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return VISIBLE_GLYPH_KEYS;
    return VISIBLE_GLYPH_KEYS.filter(key => {
      if (key.toLowerCase().includes(q)) return true;
      return GLYPHS[key].keywords.some(kw => kw.toLowerCase().includes(q));
    });
  }, [query]);

  const rows: GlyphKey[][] = [];
  for (let i = 0; i < visibleKeys.length; i += ROW) {
    rows.push(visibleKeys.slice(i, i + ROW));
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <SymbolView
          name="magnifyingglass"
          size={14}
          tintColor={theme.colors.label3}
          resizeMode="scaleAspectFit"
          fallback={
            <MaterialCommunityIcons
              name="magnify"
              size={16}
              color={theme.colors.label3}
            />
          }
        />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search icons"
          placeholderTextColor={theme.colors.label3}
          style={[styles.searchInput, { color: theme.colors.text }]}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>
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
                    name={GLYPHS[key].symbol}
                    size={18}
                    tintColor={selected ? '#fff' : theme.colors.label2}
                    resizeMode="scaleAspectFit"
                    fallback={
                      <MaterialCommunityIcons
                        name={getMaterialIcon(key)}
                        size={20}
                        color={selected ? '#fff' : theme.colors.label2}
                      />
                    }
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
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    paddingVertical: 12,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 12,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 9,
    backgroundColor: theme.colors.fill4,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
    letterSpacing: -0.2,
  },
  grid: {
    paddingHorizontal: 12,
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
