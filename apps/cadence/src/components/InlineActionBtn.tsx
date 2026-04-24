import { SFSymbol, SymbolView } from 'expo-symbols';
import { Platform, Pressable, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { UI_SYMBOL_TO_MATERIAL } from '../utils/glyphs';

interface InlineActionBtnProps {
  label: string;
  symbol: SFSymbol;
  color?: string;
  onPress: () => void;
}

export default function InlineActionBtn({
  label,
  symbol,
  color,
  onPress,
}: InlineActionBtnProps) {
  const { theme } = useUnistyles();
  const iconColor = color ?? theme.colors.blue;
  const materialIconName =
    UI_SYMBOL_TO_MATERIAL[symbol as string] ?? 'help-circle-outline';

  return (
    <Pressable
      onPress={onPress}
      android_ripple={
        Platform.OS === 'android'
          ? { color: theme.colors.fill2, borderless: false }
          : undefined
      }
      style={styles.btn}
    >
      <SymbolView
        name={symbol}
        size={18}
        tintColor={iconColor}
        resizeMode="scaleAspectFit"
        fallback={
          <MaterialCommunityIcons
            name={materialIconName}
            size={20}
            color={iconColor}
          />
        }
      />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create(theme => ({
  btn: {
    flex: 1,
    backgroundColor: theme.colors.fill4,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 4,
    overflow: 'hidden',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.label2,
    letterSpacing: -0.1,
  },
}));
