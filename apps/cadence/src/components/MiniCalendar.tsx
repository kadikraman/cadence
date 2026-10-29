import { Host } from '@expo/ui';
import { DatePicker } from '@expo/ui/swift-ui';
import { datePickerStyle, tint } from '@expo/ui/swift-ui/modifiers';
import { useMemo } from 'react';
import { useUnistyles } from 'react-native-unistyles';
import { normalizeToMidnight } from '../utils/taskUtils';

interface MiniCalendarProps {
  selected: number;
  onSelect: (ts: number) => void;
  maxDate?: number;
}

export default function MiniCalendar({
  selected,
  onSelect,
  maxDate,
}: MiniCalendarProps) {
  const { theme } = useUnistyles();
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
        modifiers={[datePickerStyle('graphical'), tint(theme.colors.blue)]}
      />
    </Host>
  );
}
