import { BottomSheet as NativeBottomSheet, RNHostView } from '@expo/ui';
import { ReactNode } from 'react';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function BottomSheet({
  visible,
  onClose,
  children,
}: BottomSheetProps) {
  const { theme } = useUnistyles();

  return (
    <NativeBottomSheet
      isPresented={visible}
      onDismiss={() => {
        if (visible) onClose();
      }}
      contentPadding={0}
      containerColor={theme.colors.surfaceElevated}
    >
      <RNHostView matchContents>
        <View style={styles.sheet}>{children}</View>
      </RNHostView>
    </NativeBottomSheet>
  );
}

const styles = StyleSheet.create((_theme, rt) => ({
  sheet: {
    width: rt.screen.width,
    maxHeight: rt.screen.height - rt.insets.top - 12,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
}));
