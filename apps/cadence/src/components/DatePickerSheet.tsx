import { useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import {
  getTodayTimestamp,
  MS_DAY,
  normalizeToMidnight,
} from '../utils/taskUtils';
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

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHOW_DURATION = 280;
const HIDE_DURATION = 220;

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
  const [mounted, setMounted] = useState(visible);
  const [selected, setSelected] = useState(() =>
    normalizeToMidnight(initialDate)
  );

  const backdropOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    if (visible) {
      setSelected(normalizeToMidnight(initialDate));
      setMounted(true);
      backdropOpacity.value = withTiming(1, { duration: SHOW_DURATION });
      sheetTranslateY.value = withTiming(0, {
        duration: SHOW_DURATION,
        easing: Easing.out(Easing.cubic),
      });
    } else if (mounted) {
      backdropOpacity.value = withTiming(0, { duration: HIDE_DURATION });
      sheetTranslateY.value = withTiming(
        SCREEN_HEIGHT,
        { duration: HIDE_DURATION, easing: Easing.in(Easing.cubic) },
        finished => {
          if (finished) runOnJS(setMounted)(false);
        }
      );
    }
  }, [visible, initialDate, mounted, backdropOpacity, sheetTranslateY]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

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

  if (!mounted) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View
          style={[
            styles.backdrop,
            { backgroundColor: c.overlay },
            backdropStyle,
          ]}
        >
          <Pressable style={styles.backdropPress} onPress={onClose} />
        </Animated.View>
        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: c.surfaceElevated },
            sheetStyle,
          ]}
        >
          <View style={[styles.grabber, { backgroundColor: c.fill2 }]} />
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
            style={[
              styles.selectedPanel,
              { backgroundColor: c.groupedBackground },
            ]}
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
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropPress: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
