import { useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { getTodayTimestamp, normalizeToMidnight } from '../utils/taskUtils';
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

const MS_DAY = 86400000;

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
  const today = getTodayTimestamp();
  const [selected, setSelected] = useState(() =>
    normalizeToMidnight(initialDate)
  );

  useEffect(() => {
    if (visible) setSelected(normalizeToMidnight(initialDate));
  }, [visible, initialDate]);

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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.grabber} />
          <View style={styles.header}>
            <Pressable onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Text style={styles.title}>{headerTitle}</Text>
            <Pressable onPress={() => onSave(selected)}>
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>

          <View style={styles.selectedPanel}>
            <Text style={styles.selectedLabel}>{selectedLabel}</Text>
            <Text style={styles.selectedDate}>{selectedDateLabel}</Text>
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
                    isSelected && { backgroundColor: theme.colors.blue },
                  ]}
                >
                  <Text
                    style={[
                      styles.quickText,
                      isSelected && styles.quickTextSelected,
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
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create(theme => ({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.surfaceElevated,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  grabber: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.colors.fill2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cancelText: {
    color: theme.colors.blue,
    fontSize: 16,
  },
  saveText: {
    color: theme.colors.blue,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  selectedPanel: {
    padding: 14,
    backgroundColor: theme.colors.groupedBackground,
    borderRadius: 12,
    marginBottom: 14,
    alignItems: 'center',
  },
  selectedLabel: {
    fontSize: 12,
    color: theme.colors.label3,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    fontWeight: '600',
  },
  selectedDate: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
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
    backgroundColor: theme.colors.fill3,
    alignItems: 'center',
  },
  quickText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.text,
    letterSpacing: -0.1,
  },
  quickTextSelected: {
    color: '#fff',
  },
}));
