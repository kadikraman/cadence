import { Button, HStack, Image, Spacer, Text } from '@expo/ui/swift-ui';
import { foregroundStyle, frame } from '@expo/ui/swift-ui/modifiers';
import type { ColorValue } from 'react-native';
import type { SFSymbol } from 'expo-symbols';
import { useUnistyles } from 'react-native-unistyles';

interface LinkRowProps {
  title: string;
  symbol: SFSymbol;
  symbolColor: ColorValue;
  value?: string;
  chevron?: boolean;
  onPress: () => void;
}

export default function LinkRow({
  title,
  symbol,
  symbolColor,
  value,
  chevron = true,
  onPress,
}: LinkRowProps) {
  const { theme } = useUnistyles();

  return (
    <Button onPress={onPress}>
      <HStack spacing={12}>
        <Image
          systemName={symbol}
          size={18}
          color={symbolColor}
          modifiers={[frame({ width: 24 })]}
        />
        <Text modifiers={[foregroundStyle(theme.colors.text)]}>{title}</Text>
        <Spacer />
        {value !== undefined && (
          <Text modifiers={[foregroundStyle(theme.colors.label3)]}>
            {value}
          </Text>
        )}
        {chevron && (
          <Image
            systemName="chevron.right"
            size={13}
            modifiers={[foregroundStyle(theme.colors.label4)]}
          />
        )}
      </HStack>
    </Button>
  );
}
