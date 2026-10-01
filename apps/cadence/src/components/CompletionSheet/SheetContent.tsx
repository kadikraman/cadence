import { Fragment, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { Task } from '../../lib/types';
import { completeTaskAt } from '../../stores/taskReducers';
import {
  formatDayPhrase,
  formatDueIn,
  formatShortDay,
  getNextDueDate,
  getTodayTimestamp,
  isOverdue,
} from '../../utils/taskUtils';
import MiniCalendar from '../MiniCalendar';
import UiSymbol from '../ui/UiSymbol';
import DayOptionRow from './DayOptionRow';
import { buildDayOptions, defaultSelection } from './helpers';
import NextDuePreview from './NextDuePreview';
import SheetHeader from './SheetHeader';
import type { CompletionEdit } from './types';

interface SheetContentProps {
  task: Task;
  editing: CompletionEdit | null;
  onClose: () => void;
  onConfirm: (ts: number) => void;
}

export default function SheetContent({
  task,
  editing,
  onClose,
  onConfirm,
}: SheetContentProps) {
  const { theme } = useUnistyles();
  const c = theme.colors;
  const today = getTodayTimestamp();
  const [selected, setSelected] = useState(() =>
    defaultSelection(today, editing)
  );
  const [calendarOpen, setCalendarOpen] = useState(false);

  const options = buildDayOptions(task, today, editing !== null);
  const customSelected = !options.some(o => o.ts === selected);

  const nextDue = getNextDueDate(completeTaskAt(task, selected));
  const late = nextDue < today;
  const note =
    editing && editing.nextDue !== nextDue
      ? `was ${formatShortDay(editing.nextDue)}`
      : late
        ? `still ${formatDueIn(nextDue, today)}`
        : formatDueIn(nextDue, today);

  const unchanged = editing?.date === selected;
  const confirmLabel = editing
    ? `Move to ${formatDayPhrase(selected, today)}`
    : `Mark done ${formatDayPhrase(selected, today, 'on ')}`;

  return (
    <>
      <SheetHeader
        task={task}
        overdue={!editing && isOverdue(task, today)}
        onClose={onClose}
      />

      <ScrollView style={styles.scroll} bounces={false}>
        <View style={styles.group}>
          {options.map(o => (
            <Fragment key={o.ts}>
              <DayOptionRow
                label={o.label}
                detail={formatShortDay(o.ts)}
                selected={selected === o.ts}
                current={editing?.date === o.ts}
                onPress={() => {
                  setSelected(o.ts);
                  setCalendarOpen(false);
                }}
              />
              <View style={styles.separator} />
            </Fragment>
          ))}
          <DayOptionRow
            label="Other date…"
            detail={customSelected ? formatShortDay(selected) : undefined}
            selected={customSelected}
            link
            trailingSymbol={calendarOpen ? 'chevron.down' : 'chevron.right'}
            onPress={() => setCalendarOpen(open => !open)}
          />
        </View>

        {calendarOpen && (
          <View style={styles.calendar}>
            <MiniCalendar
              selected={selected}
              onSelect={setSelected}
              maxDate={today}
            />
          </View>
        )}
      </ScrollView>

      <NextDuePreview nextDue={nextDue} note={note} late={late} />

      <Pressable
        onPress={() => onConfirm(selected)}
        disabled={unchanged}
        accessibilityRole="button"
        style={[
          styles.confirmBtn,
          {
            backgroundColor: editing ? c.blue : c.success,
          },
          unchanged && styles.confirmDisabled,
        ]}
      >
        {!editing && (
          <UiSymbol name="checkmark" size={17} color={c.primaryText} />
        )}
        <Text style={styles.confirmText}>{confirmLabel}</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create(theme => ({
  scroll: {
    flexGrow: 0,
    flexShrink: 1,
    marginBottom: 14,
  },
  group: {
    backgroundColor: theme.colors.fill3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.sep,
    marginLeft: 16,
  },
  calendar: {
    marginTop: 14,
  },
  confirmBtn: {
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  confirmDisabled: {
    opacity: 0.4,
  },
  confirmText: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.primaryText,
  },
}));
