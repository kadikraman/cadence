import {
  FadeIn,
  FadeOut,
  LinearTransition,
  ZoomIn,
} from 'react-native-reanimated';

export const todoLayout = LinearTransition.duration(220);
export const todoEntering = FadeIn.duration(220);
export const todoExiting = FadeOut.duration(160);
export const checkEntering = ZoomIn.springify().damping(14);
