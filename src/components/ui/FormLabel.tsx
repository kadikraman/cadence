import { ReactNode } from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface FormLabelProps {
  children: ReactNode;
}

export default function FormLabel({ children }: FormLabelProps) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create(theme => ({
  label: {
    paddingHorizontal: 32,
    paddingTop: 18,
    paddingBottom: 6,
    fontSize: 13,
    color: theme.colors.label3,
    textTransform: 'uppercase',
    letterSpacing: -0.08,
    fontWeight: '500',
  },
}));
