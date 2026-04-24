import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Variant = 'filled' | 'tonal' | 'outlined';

interface MaterialButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: Variant;
  icon?: string;
  full?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export default function MaterialButton({
  children,
  onPress,
  variant = 'filled',
  icon,
  full = false,
  disabled = false,
  accessibilityLabel,
}: MaterialButtonProps) {
  const { theme } = useUnistyles();

  const bg =
    variant === 'filled'
      ? theme.colors.primary
      : variant === 'tonal'
        ? theme.colors.secondaryContainer
        : 'transparent';
  const fg =
    variant === 'filled'
      ? theme.colors.onPrimary
      : variant === 'tonal'
        ? theme.colors.onSecondaryContainer
        : theme.colors.primary;
  const borderColor =
    variant === 'outlined' ? theme.colors.outline : 'transparent';
  const rippleColor =
    variant === 'filled' ? 'rgba(255,255,255,0.20)' : theme.colors.fill2;

  return (
    <View style={[full && { flex: 1 }, { opacity: disabled ? 0.38 : 1 }]}>
      <Pressable
        onPress={disabled ? undefined : onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        android_ripple={
          disabled ? undefined : { color: rippleColor, borderless: false }
        }
        style={[
          styles.btn,
          {
            backgroundColor: bg,
            borderColor,
            borderWidth: variant === 'outlined' ? 1 : 0,
          },
        ]}
      >
        {icon && <MaterialCommunityIcons name={icon} size={18} color={fg} />}
        <Text style={[styles.label, { color: fg }]}>{children}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create(() => ({
  btn: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
}));
