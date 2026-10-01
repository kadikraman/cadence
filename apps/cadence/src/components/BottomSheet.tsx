import { ReactNode, useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHOW_DURATION = 280;
const HIDE_DURATION = 220;

export default function BottomSheet({
  visible,
  onClose,
  children,
}: BottomSheetProps) {
  const [mounted, setMounted] = useState(visible);
  const [prevVisible, setPrevVisible] = useState(visible);

  const backdropOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(SCREEN_HEIGHT);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) setMounted(true);
  }

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: SHOW_DURATION });
      sheetTranslateY.value = withTiming(0, {
        duration: SHOW_DURATION,
        easing: Easing.out(Easing.cubic),
      });
    } else if (mounted) {
      backdropOpacity.value = withTiming(0, { duration: HIDE_DURATION });
      sheetTranslateY.value = withTiming(
        SCREEN_HEIGHT,
        { duration: HIDE_DURATION, easing: Easing.in(Easing.cubic) },
        finished => {
          if (finished) runOnJS(setMounted)(false);
        }
      );
    }
  }, [visible, mounted, backdropOpacity, sheetTranslateY]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  if (!mounted) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={styles.backdropPress} onPress={onClose} />
        </Animated.View>
        <Animated.View style={[styles.sheetPosition, sheetStyle]}>
          <View style={styles.sheet}>
            <View style={styles.grabber} />
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  root: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropPress: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
  },
  sheetPosition: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    maxHeight: rt.screen.height - rt.insets.top - 12,
    backgroundColor: theme.colors.surfaceElevated,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  grabber: {
    width: 36,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 14,
    backgroundColor: theme.colors.fill2,
  },
}));
