import { Host } from '@expo/ui';
import { Button, Label } from '@expo/ui/swift-ui';
import {
  buttonStyle,
  controlSize,
  foregroundStyle,
  frame,
  labelStyle,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import type { SFSymbol } from 'expo-symbols';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import { Platform } from 'react-native';

interface NativeButtonProps {
  title: string;
  systemImage?: SFSymbol;
  color?: ColorValue;
  prominent?: boolean;
  destructive?: boolean;
  iconOnly?: boolean;
  style?: ComponentProps<typeof Host>['style'];
  onPress: () => void;
}

const SUPPORTS_GLASS = Number(Platform.Version) >= 26;

export default function NativeButton({
  title,
  systemImage,
  color,
  prominent = false,
  destructive = false,
  iconOnly = false,
  style,
  onPress,
}: NativeButtonProps) {
  const variant = prominent
    ? SUPPORTS_GLASS
      ? 'glassProminent'
      : 'borderedProminent'
    : SUPPORTS_GLASS
      ? 'glass'
      : 'bordered';

  return (
    <Host matchContents={{ vertical: true }} style={style}>
      <Button
        role={destructive ? 'destructive' : undefined}
        onPress={onPress}
        modifiers={[
          buttonStyle(variant),
          controlSize('large'),
          ...(color && prominent ? [tint(color)] : []),
        ]}
      >
        <Label
          title={title}
          systemImage={systemImage}
          modifiers={[
            ...(iconOnly ? [labelStyle('iconOnly')] : []),
            ...(color && !prominent ? [foregroundStyle(color)] : []),
            frame({ maxWidth: Infinity }),
          ]}
        />
      </Button>
    </Host>
  );
}
