import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { SymbolView } from 'expo-symbols';
import { Pressable, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface Props {
  label: string;
  onPress: () => void;
}

export default function GlassBackButton({ label, onPress }: Props) {
  const { theme } = useUnistyles();
  const glass = isLiquidGlassAvailable();

  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <GlassView
        glassEffectStyle="regular"
        isInteractive
        style={[styles.pill, !glass && styles.pillFallback]}
      >
        <SymbolView
          name="chevron.left"
          size={18}
          tintColor={theme.colors.blue}
          resizeMode="scaleAspectFit"
          fallback={null}
        />
        <Text style={styles.text}>{label}</Text>
      </GlassView>
    </Pressable>
  );
}

const styles = StyleSheet.create(theme => ({
  wrap: {
    alignSelf: 'flex-start',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 14,
    borderRadius: 22,
  },
  pillFallback: {
    backgroundColor: theme.colors.surfaceElevated,
  },
  text: {
    color: theme.colors.blue,
    fontSize: 17,
  },
}));
