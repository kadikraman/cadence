import { Host, Switch } from '@expo/ui';
import { labelsHidden } from '@expo/ui/swift-ui/modifiers';

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
      <Switch
        value={value}
        onValueChange={onValueChange}
        modifiers={[labelsHidden()]}
      />
    </Host>
  );
}
