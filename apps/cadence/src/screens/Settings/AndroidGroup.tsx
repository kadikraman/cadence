import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface AndroidGroupProps {
  title: string;
  children: ReactNode;
}

export default function AndroidGroup({ title, children }: AndroidGroupProps) {
  const { theme } = useUnistyles();
  return (
    <View style={styles.group}>
      <Text style={[styles.label, { color: theme.colors.primary }]}>
        {title}
      </Text>
      <View
        style={[
          styles.body,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create(() => ({
  group: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 8,
  },
  body: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
}));
