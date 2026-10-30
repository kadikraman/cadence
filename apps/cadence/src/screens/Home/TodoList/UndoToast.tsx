import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import SwipeDownToDismiss from '../../../components/SwipeDownToDismiss';
import type { TodoUndo } from './types';

interface UndoToastProps {
  undo: TodoUndo | null;
  onUndo: () => void;
  onDismiss: () => void;
}

const VISIBLE_MS = 5000;
const KEYBOARD_GAP = 8;

export default function UndoToast({ undo, onUndo, onDismiss }: UndoToastProps) {
  const { rt } = useUnistyles();
  const key = undo?.key;

  useEffect(() => {
    if (key === undefined) return;
    const timer = setTimeout(onDismiss, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [key, onDismiss]);

  return (
    <KeyboardStickyView
      style={styles.position}
      offset={{ opened: Math.max(rt.insets.bottom, 16) - KEYBOARD_GAP }}
      pointerEvents="box-none"
    >
      {undo && (
        <Animated.View
          key={undo.key}
          entering={FadeInDown.duration(220)}
          exiting={FadeOutDown.duration(180)}
          accessibilityLiveRegion="polite"
        >
          <SwipeDownToDismiss onDismiss={onDismiss}>
            <View style={styles.toast}>
              <Text style={styles.message} numberOfLines={2}>
                {undo.message}
              </Text>
              <Pressable
                onPress={onUndo}
                accessibilityRole="button"
                hitSlop={8}
              >
                <Text style={styles.action}>Undo</Text>
              </Pressable>
            </View>
          </SwipeDownToDismiss>
        </Animated.View>
      )}
    </KeyboardStickyView>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  position: {
    position: 'absolute',
    left: 16 + rt.insets.left,
    right: 16 + rt.insets.right,
    bottom: Math.max(rt.insets.bottom, 16),
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor:
      rt.themeName === 'dark' ? 'rgba(58,58,60,0.96)' : 'rgba(28,28,30,0.94)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  },
  message: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.white,
  },
  action: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0A84FF',
  },
}));
