import { SFSymbol, SymbolView } from 'expo-symbols';
import { Platform, Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons/static';
import { UI_SYMBOL_TO_MATERIAL } from '../../utils/glyphs';

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
  const materialIconName =
    UI_SYMBOL_TO_MATERIAL[symbol as string] ?? 'help-circle-outline';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      android_ripple={
        Platform.OS === 'android'
          ? {
              color: filled ? 'rgba(255,255,255,0.20)' : theme.colors.fill2,
              borderless: false,
              radius: size / 2,
            }
          : undefined
      }
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
        fallback={
          <MaterialCommunityIcons
            name={materialIconName}
            size={Math.round(size * 0.55)}
            color={tintColor}
          />
        }
      />
    </Pressable>
  );
}

const styles = StyleSheet.create(() => ({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
}));
