import { SFSymbol, SymbolView } from 'expo-symbols';
import { Pressable, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

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
  return (
    <Pressable onPress={onPress} style={styles.btn}>
      <SymbolView
        name={symbol}
        size={18}
        tintColor={iconColor}
        resizeMode="scaleAspectFit"
        fallback={null}
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
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.label2,
    letterSpacing: -0.1,
  },
}));
