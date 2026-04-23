import { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface FormGroupProps {
  children: ReactNode;
  style?: ViewStyle;
}

export default function FormGroup({ children, style }: FormGroupProps) {
  return <View style={[styles.group, style]}>{children}</View>;
}

const styles = StyleSheet.create(theme => ({
  group: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 12,
    overflow: 'hidden',
  },
}));
