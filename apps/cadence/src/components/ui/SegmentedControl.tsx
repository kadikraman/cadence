import { SegmentedControl as NativeSegmentedControl } from '@expo/ui/community/segmented-control';
import { useMemo } from 'react';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const labels = useMemo(() => options.map(o => o.label), [options]);

  return (
    <NativeSegmentedControl
      values={labels}
      selectedIndex={options.findIndex(o => o.value === value)}
      onChange={e =>
        onChange(options[e.nativeEvent.selectedSegmentIndex].value)
      }
    />
  );
}
