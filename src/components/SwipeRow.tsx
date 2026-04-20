import { SFSymbol, SymbolView } from 'expo-symbols';
import { ReactNode, useEffect, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

export interface SwipeAction {
  label: string;
  symbol: SFSymbol;
  color: string;
  onPress: () => void;
}

interface SwipeRowProps {
  children: ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onTap?: () => void;
  onLongPress?: () => void;
  backgroundColor?: string;
}

const ACTION_WIDTH = 78;
const SETTLE_THRESHOLD = 0.5;

export default function SwipeRow({
  children,
  leftActions = [],
  rightActions = [],
  onTap,
  onLongPress,
  backgroundColor,
}: SwipeRowProps) {
  const leftWidth = leftActions.length * ACTION_WIDTH;
  const rightWidth = rightActions.length * ACTION_WIDTH;

  const offset = useSharedValue(0);
  const settled = useSharedValue(0);
  const settledRef = useRef(0);

  const reset = () => {
    'worklet';
    settled.value = 0;
    offset.value = withSpring(0, { damping: 20, stiffness: 220 });
  };

  const fireAction = (action: SwipeAction) => {
    settledRef.current = 0;
    settled.value = 0;
    offset.value = withSpring(0, { damping: 20, stiffness: 220 });
    action.onPress();
  };

  const updateSettledRef = (v: number) => {
    settledRef.current = v;
  };

  const handleTap = () => {
    if (settledRef.current !== 0) {
      reset();
      return;
    }
    onTap?.();
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-14, 14])
    .onStart(() => {
      offset.value = settled.value;
    })
    .onUpdate(e => {
      const base = settled.value + e.translationX;
      const maxR = leftWidth + 30;
      const maxL = -(rightWidth + 30);
      offset.value = Math.max(maxL, Math.min(maxR, base));
    })
    .onEnd(() => {
      const total = offset.value;
      let final = 0;
      if (total > leftWidth * SETTLE_THRESHOLD && leftWidth > 0) {
        final = leftWidth;
      } else if (total < -rightWidth * SETTLE_THRESHOLD && rightWidth > 0) {
        final = -rightWidth;
      }
      settled.value = final;
      runOnJS(updateSettledRef)(final);
      offset.value = withSpring(final, { damping: 20, stiffness: 220 });
    });

  const longPress = Gesture.LongPress()
    .minDuration(500)
    .maxDistance(10)
    .onStart(() => {
      if (onLongPress) runOnJS(onLongPress)();
    });

  const tap = Gesture.Tap()
    .maxDistance(10)
    .onEnd((_e, success) => {
      if (success) runOnJS(handleTap)();
    });

  const composed = Gesture.Race(pan, Gesture.Exclusive(longPress, tap));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  useEffect(() => {
    return () => {
      settled.value = 0;
      offset.value = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root}>
      {rightActions.length > 0 && (
        <View style={[styles.actionLayer, styles.rightLayer]}>
          {rightActions.map((a, i) => (
            <Pressable
              key={i}
              onPress={() => fireAction(a)}
              style={[styles.actionBtn, { backgroundColor: a.color }]}
            >
              <SymbolView
                name={a.symbol}
                size={22}
                tintColor="#fff"
                resizeMode="scaleAspectFit"
                fallback={null}
              />
              <Text style={styles.actionLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
      {leftActions.length > 0 && (
        <View style={[styles.actionLayer, styles.leftLayer]}>
          {leftActions.map((a, i) => (
            <Pressable
              key={i}
              onPress={() => fireAction(a)}
              style={[styles.actionBtn, { backgroundColor: a.color }]}
            >
              <SymbolView
                name={a.symbol}
                size={24}
                tintColor="#fff"
                resizeMode="scaleAspectFit"
                fallback={null}
              />
              <Text style={styles.actionLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
      <GestureDetector gesture={composed}>
        <Animated.View
          style={[
            styles.content,
            animatedStyle,
            backgroundColor ? { backgroundColor } : null,
          ]}
        >
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  root: {
    position: 'relative',
    overflow: 'hidden',
  },
  actionLayer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  leftLayer: {
    left: 0,
  },
  rightLayer: {
    right: 0,
  },
  actionBtn: {
    width: ACTION_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  content: {
    backgroundColor: theme.colors.surfaceElevated,
    position: 'relative',
    zIndex: 1,
  },
}));
