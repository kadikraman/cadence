import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import {
  getTodayTimestamp,
  MS_DAY,
  normalizeToMidnight,
} from '../utils/taskUtils';
import BottomSheet from './BottomSheet';
import MiniCalendar from './MiniCalendar';

export interface QuickOption {
  label: string;
  ts: number;
}

interface DatePickerSheetProps {
  visible: boolean;
  initialDate: number;
  mode?: 'new' | 'edit';
  title?: string;
  selectedLabel?: string;
  quickOptions?: QuickOption[];
  allowFuture?: boolean;
  onClose: () => void;
  onSave: (ts: number) => void;
}

export default function DatePickerSheet({
  visible,
  initialDate,
  mode = 'new',
  title,
  selectedLabel = 'Completed',
  quickOptions,
  allowFuture = false,
  onClose,
  onSave,
}: DatePickerSheetProps) {
  const { theme } = useUnistyles();
  const c = theme.colors;
  const today = getTodayTimestamp();
  const [selected, setSelected] = useState(() =>
    normalizeToMidnight(initialDate)
  );
  const [prevVisible, setPrevVisible] = useState(visible);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) setSelected(normalizeToMidnight(initialDate));
  }

  const options: QuickOption[] = quickOptions ?? [
    { label: 'Today', ts: today },
    { label: 'Yesterday', ts: today - MS_DAY },
    { label: '2 days ago', ts: today - 2 * MS_DAY },
    { label: '3 days ago', ts: today - 3 * MS_DAY },
  ];

  const headerTitle =
    title ?? (mode === 'edit' ? 'Edit completion' : 'Log completion');

  const selectedDateLabel = new Date(selected).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Pressable onPress={onClose}>
          <Text style={[styles.cancelText, { color: c.blue }]}>Cancel</Text>
        </Pressable>
        <Text style={[styles.title, { color: c.text }]}>{headerTitle}</Text>
        <Pressable onPress={() => onSave(selected)}>
          <Text style={[styles.saveText, { color: c.blue }]}>Save</Text>
        </Pressable>
      </View>

      <View
        style={[styles.selectedPanel, { backgroundColor: c.groupedBackground }]}
      >
        <Text style={[styles.selectedLabel, { color: c.label3 }]}>
          {selectedLabel}
        </Text>
        <Text style={[styles.selectedDate, { color: c.text }]}>
          {selectedDateLabel}
        </Text>
      </View>

      <View style={styles.quickRow}>
        {options.map(o => {
          const isSelected = selected === o.ts;
          return (
            <Pressable
              key={o.ts}
              onPress={() => setSelected(o.ts)}
              style={[
                styles.quickBtn,
                { backgroundColor: isSelected ? c.blue : c.fill3 },
              ]}
            >
              <Text
                style={[
                  styles.quickText,
                  { color: isSelected ? '#fff' : c.text },
                ]}
              >
                {o.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <MiniCalendar
        selected={selected}
        onSelect={setSelected}
        maxDate={allowFuture ? undefined : today}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cancelText: {
    fontSize: 16,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedPanel: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    alignItems: 'center',
  },
  selectedLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    fontWeight: '600',
  },
  selectedDate: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: -0.4,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  quickBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  quickText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
});
