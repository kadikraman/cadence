import { SFSymbol, SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface IconButtonProps {
  symbol: SFSymbol;
  onPress: () => void;
  filled?: boolean;
  size?: number;
  accessibilityLabel?: string;
}

export default function IconButton({
  symbol,
  onPress,
  filled = false,
  size = 36,
  accessibilityLabel,
}: IconButtonProps) {
  const { theme } = useUnistyles();
  const tintColor = filled ? theme.colors.white : theme.colors.label2;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: filled ? theme.colors.blue : theme.colors.fill4,
        },
      ]}
    >
      <SymbolView
        name={symbol}
        size={Math.round(size * 0.5)}
        tintColor={tintColor}
        resizeMode="scaleAspectFit"
        fallback={null}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create(() => ({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
