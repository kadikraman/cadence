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
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <View style={styles.navRow}>
          <Pressable onPress={prev} style={styles.navBtn}>
            <SymbolView
              name="chevron.left"
              size={14}
              tintColor={theme.colors.text}
              resizeMode="scaleAspectFit"
              fallback={null}
            />
          </Pressable>
          <Pressable onPress={next} style={styles.navBtn}>
            <SymbolView
              name="chevron.right"
              size={14}
              tintColor={theme.colors.text}
              resizeMode="scaleAspectFit"
              fallback={null}
            />
          </Pressable>
        </View>
      </View>
      <View style={styles.dowRow}>
        {DAYS.map((d, i) => (
          <Text key={i} style={styles.dow}>
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
                isSelected && { backgroundColor: theme.colors.blue },
              ]}
            >
              <Text
                style={[
                  styles.dayText,
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

const styles = StyleSheet.create(theme => ({
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
    color: theme.colors.text,
  },
  navRow: {
    flexDirection: 'row',
    gap: 6,
  },
  navBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.fill3,
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
    color: theme.colors.label3,
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
    color: theme.colors.text,
    fontWeight: '500',
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  dayTextDisabled: {
    opacity: 0.3,
  },
}));
