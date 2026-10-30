import { useWindowDimensions } from 'react-native';

const WIDE_LAYOUT_MIN_WIDTH = 600;

export function useWideLayout() {
  const { width } = useWindowDimensions();
  return { width, wide: width >= WIDE_LAYOUT_MIN_WIDTH };
}
