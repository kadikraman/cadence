import { useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

interface SnackbarProps {
  snackKey: number | undefined;
  message: string | undefined;
  actionLabel: string;
  bottomOffset?: number;
  onAction: () => void;
  onDismiss: () => void;
}

const VISIBLE_MS = 5000;

export default function Snackbar({
  snackKey,
  message,
  actionLabel,
  bottomOffset = 0,
  onAction,
  onDismiss,
}: SnackbarProps) {
  useEffect(() => {
    if (snackKey === undefined) return;
    const timer = setTimeout(onDismiss, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [snackKey, onDismiss]);

  if (snackKey === undefined || !message) return null;

  return (
    <Animated.View
      key={snackKey}
      entering={FadeInDown.duration(220)}
      exiting={FadeOutDown.duration(180)}
      style={styles.snackbar(bottomOffset)}
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
      <Pressable onPress={onAction} accessibilityRole="button" hitSlop={8}>
        <Text style={styles.action}>{actionLabel}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  snackbar: (bottomOffset: number) => ({
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: Math.max(rt.insets.bottom, 16) + bottomOffset,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    backgroundColor: rt.themeName === 'dark' ? '#E6E0E9' : '#322F35',
    elevation: 6,
  }),
  message: {
    flex: 1,
    fontSize: 14,
    letterSpacing: 0.25,
    color: rt.themeName === 'dark' ? '#322F35' : '#F5EFF7',
  },
  action: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    color: rt.themeName === 'dark' ? '#0061A4' : theme.colors.primaryContainer,
  },
}));
