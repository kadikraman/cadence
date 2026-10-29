import { Host } from '@expo/ui';
import { DatePicker } from '@expo/ui/swift-ui';
import {
  datePickerStyle,
  environment,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { useMemo } from 'react';
import { useUnistyles } from 'react-native-unistyles';
import { useSettingsStore } from '../stores/settings';
import { normalizeToMidnight } from '../utils/taskUtils';

interface MiniCalendarProps {
  selected: number;
  onSelect: (ts: number) => void;
  maxDate?: number;
}

const BASE_LOCALE = Intl.DateTimeFormat()
  .resolvedOptions()
  .locale.replace('-', '_');

export default function MiniCalendar({
  selected,
  onSelect,
  maxDate,
}: MiniCalendarProps) {
  const { theme } = useUnistyles();
  const weekStartsOnMonday = useSettingsStore(s => s.weekStartsOnMonday);
  const selection = useMemo(() => new Date(selected), [selected]);
  const range = useMemo(
    () => (maxDate === undefined ? undefined : { end: new Date(maxDate) }),
    [maxDate]
  );

  return (
    <Host matchContents={{ vertical: true }}>
      <DatePicker
        selection={selection}
        range={range}
        onDateChange={date => onSelect(normalizeToMidnight(date.getTime()))}
        modifiers={[
          datePickerStyle('graphical'),
          tint(theme.colors.blue),
          environment(
            'locale',
            `${BASE_LOCALE}@fw=${weekStartsOnMonday ? 'mon' : 'sun'}`
          ),
        ]}
      />
    </Host>
  );
}
