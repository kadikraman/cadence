import { Picker } from '@expo/ui/jetpack-compose';

import { StyleProp, View, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface SegmentedPickerProps<T extends string> {
  options: T[];
  selectedIndex: number;
  onOptionSelected: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

export default function SegmentedPicker<T extends string>({
  options,
  selectedIndex,
  onOptionSelected,
  style,
}: SegmentedPickerProps<T>) {
  return (
    <View style={[styles.container, style]}>
      <Picker
        options={options as string[]}
        selectedIndex={selectedIndex}
        onOptionSelected={({ nativeEvent: { index } }) => {
          onOptionSelected(index);
        }}
        variant="segmented"
      />
    </View>
  );
}

const styles = StyleSheet.create(() => ({
  container: {
    width: '100%',
  },
}));
