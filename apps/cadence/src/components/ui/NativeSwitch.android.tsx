import { Host, Switch } from '@expo/ui';

interface NativeSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export default function NativeSwitch({
  value,
  onValueChange,
}: NativeSwitchProps) {
  return (
    <Host matchContents>
      <Switch value={value} onValueChange={onValueChange} />
    </Host>
  );
}
