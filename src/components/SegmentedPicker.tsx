import { Host, Picker, Text } from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
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
      <Host style={styles.host}>
        <Picker
          selection={selectedIndex}
          onSelectionChange={(selection) => {
            onOptionSelected(selection as number);
          }}
          modifiers={[pickerStyle('segmented')]}
        >
          {options.map((option, index) => (
            <Text key={option} modifiers={[tag(index)]}>
              {option}
            </Text>
          ))}
        </Picker>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create(() => ({
  container: {
    width: '100%',
  },
  host: {
    height: 36,
    width: '100%',
  },
}));
