import { useEffect } from 'react';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import SwipeDownToDismiss from '../SwipeDownToDismiss';
import ToastCard from './ToastCard';
import type { CompletionToastData } from './types';

export type { CompletionToastData } from './types';

interface CompletionToastProps {
  toast: CompletionToastData | null;
  bottomOffset?: number;
  onChange: () => void;
  onUndo: () => void;
  onDismiss: () => void;
}

const VISIBLE_MS = 5000;

export default function CompletionToast({
  toast,
  bottomOffset = 0,
  onChange,
  onUndo,
  onDismiss,
}: CompletionToastProps) {
  const key = toast?.key;

  useEffect(() => {
    if (key === undefined) return;
    const timer = setTimeout(onDismiss, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [key, onDismiss]);

  if (!toast) return null;

  return (
    <Animated.View
      key={toast.key}
      entering={FadeInDown.duration(220)}
      exiting={FadeOutDown.duration(180)}
      style={styles.position(bottomOffset)}
      accessibilityLiveRegion="polite"
    >
      <SwipeDownToDismiss onDismiss={onDismiss}>
        <ToastCard toast={toast} onChange={onChange} onUndo={onUndo} />
      </SwipeDownToDismiss>
    </Animated.View>
  );
}

const styles = StyleSheet.create((_theme, rt) => ({
  position: (bottomOffset: number) => ({
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: Math.max(rt.insets.bottom, 16) + bottomOffset,
  }),
}));
