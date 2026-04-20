import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Task } from '../../lib/storage';
import { getTint } from '../../utils/taskTints';
import { getTodayTimestamp, normalizeToMidnight } from '../../utils/taskUtils';

interface CalendarViewProps {
  task: Task;
  completedDates: number[];
  onDayTap: (ts: number) => void;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CalendarView({
  task,
  completedDates,
  onDayTap,
}: CalendarViewProps) {
  const { theme } = useUnistyles();
  const tint = getTint(task.color);
  const today = getTodayTimestamp();
  const [monthOffset, setMonthOffset] = useState(0);

  const viewDate = new Date(today);
  viewDate.setDate(1);
  viewDate.setMonth(viewDate.getMonth() + monthOffset);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();

  const completedSet = new Set(completedDates.map(d => normalizeToMidnight(d)));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <View style={styles.nav}>
          <Pressable
            style={styles.navBtn}
            onPress={() => setMonthOffset(m => m - 1)}
          >
            <SymbolView
              name="chevron.left"
              size={14}
              tintColor={theme.colors.text}
              resizeMode="scaleAspectFit"
              fallback={null}
            />
          </Pressable>
          <Pressable
            style={[styles.navBtn, monthOffset >= 0 && styles.navBtnDisabled]}
            onPress={() => setMonthOffset(m => Math.min(0, m + 1))}
            disabled={monthOffset >= 0}
          >
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
          const isToday = ts === today;
          const isFuture = ts > today;
          const isCompleted = completedSet.has(ts);
          return (
            <Pressable
              key={day}
              style={[
                styles.cell,
                styles.dayCell,
                isCompleted && { backgroundColor: tint.accent },
                isToday &&
                  !isCompleted && {
                    borderWidth: 1.5,
                    borderColor: theme.colors.blue,
                  },
                isFuture && styles.dayFuture,
              ]}
              onPress={() => !isFuture && onDayTap(ts)}
              disabled={isFuture}
            >
              <Text
                style={[
                  styles.dayText,
                  isCompleted && styles.dayTextCompleted,
                  (isToday || isCompleted) && styles.dayTextBold,
                ]}
              >
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Tap any day to log a completion.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  card: {
    marginHorizontal: 16,
    marginTop: 4,
    padding: 14,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  nav: {
    flexDirection: 'row',
    gap: 4,
  },
  navBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.fill3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  dowRow: {
    flexDirection: 'row',
    marginBottom: 6,
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
    borderRadius: 9,
  },
  dayFuture: {
    opacity: 0.35,
  },
  dayText: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  dayTextCompleted: {
    color: '#fff',
  },
  dayTextBold: {
    fontWeight: '700',
  },
  footer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.sepSubtle,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.label3,
    textAlign: 'center',
  },
}));
