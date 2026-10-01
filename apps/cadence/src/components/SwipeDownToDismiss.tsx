import { ReactNode } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface SwipeDownToDismissProps {
  onDismiss: () => void;
  children: ReactNode;
}

const DISMISS_DISTANCE = 40;
const DISMISS_VELOCITY = 500;
const OFFSCREEN_Y = 200;

export default function SwipeDownToDismiss({
  onDismiss,
  children,
}: SwipeDownToDismissProps) {
  const dragY = useSharedValue(0);

  const swipeDown = Gesture.Pan()
    .activeOffsetY(10)
    .failOffsetX([-20, 20])
    .onUpdate(e => {
      dragY.value = Math.max(0, e.translationY);
    })
    .onEnd(e => {
      if (e.translationY > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY) {
        dragY.value = withTiming(OFFSCREEN_Y, { duration: 160 }, finished => {
          if (finished) runOnJS(onDismiss)();
        });
      } else {
        dragY.value = withSpring(0);
      }
    });

  const dragStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dragY.value }],
  }));

  return (
    <GestureDetector gesture={swipeDown}>
      <Animated.View style={dragStyle}>{children}</Animated.View>
    </GestureDetector>
  );
}
