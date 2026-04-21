import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { normalizeToMidnight } from '../utils/taskUtils';

interface MiniCalendarProps {
  selected: number;
  onSelect: (ts: number) => void;
  maxDate?: number;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function MiniCalendar({
  selected,
  onSelect,
  maxDate,
}: MiniCalendarProps) {
  const { theme } = useUnistyles();
  const c = theme.colors;
  const [cursor, setCursor] = useState(() => {
    const d = new Date(selected);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  });

  const cd = new Date(cursor);
  const year = cd.getFullYear();
  const month = cd.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const monthLabel = cd.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const prev = () => {
    const d = new Date(cursor);
    d.setMonth(d.getMonth() - 1);
    setCursor(d.getTime());
  };
  const next = () => {
    const d = new Date(cursor);
    d.setMonth(d.getMonth() + 1);
    setCursor(d.getTime());
  };

  const selectedMid = normalizeToMidnight(selected);

  return (
    <View>
      <View style={styles.header}>
        <Text style={[styles.monthLabel, { color: c.text }]}>{monthLabel}</Text>
        <View style={styles.navRow}>
          <Pressable
            onPress={prev}
            style={[styles.navBtn, { backgroundColor: c.fill3 }]}
          >
            <SymbolView
              name="chevron.left"
              size={14}
              tintColor={c.text}
              resizeMode="scaleAspectFit"
              fallback={null}
            />
          </Pressable>
          <Pressable
            onPress={next}
            style={[styles.navBtn, { backgroundColor: c.fill3 }]}
          >
            <SymbolView
              name="chevron.right"
              size={14}
              tintColor={c.text}
              resizeMode="scaleAspectFit"
              fallback={null}
            />
          </Pressable>
        </View>
      </View>
      <View style={styles.dowRow}>
        {DAYS.map((d, i) => (
          <Text key={i} style={[styles.dow, { color: c.label3 }]}>
            {d}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {Array.from({ length: firstDow }).map((_, i) => (
          <View key={`e${i}`} style={styles.cell} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const ts = new Date(year, month, day).getTime();
          const isSelected = ts === selectedMid;
          const isDisabled = maxDate !== undefined && ts > maxDate;
          return (
            <Pressable
              key={day}
              onPress={() => !isDisabled && onSelect(ts)}
              disabled={isDisabled}
              style={[
                styles.cell,
                styles.dayCell,
                isSelected && { backgroundColor: c.blue },
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  { color: isSelected ? '#fff' : c.text },
                  isSelected && styles.dayTextSelected,
                  isDisabled && styles.dayTextDisabled,
                ]}
              >
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  navRow: {
    flexDirection: 'row',
    gap: 6,
  },
  navBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dowRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dow: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 1,
  },
  dayCell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
    textAlign: 'center',
    includeFontPadding: false,
    transform: [{ translateY: -8 }],
  },
  dayTextSelected: {
    fontWeight: '600',
  },
  dayTextDisabled: {
    opacity: 0.3,
  },
});
