import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface MaterialCardProps {
  title?: string;
  children: ReactNode;
  flush?: boolean;
}

export default function MaterialCard({
  title,
  children,
  flush = false,
}: MaterialCardProps) {
  const { theme } = useUnistyles();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
    >
      {title && (
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {title}
        </Text>
      )}
      <View style={flush ? styles.flushBody : undefined}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create(() => ({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    marginBottom: 14,
  },
  flushBody: {
    marginHorizontal: -20,
    marginBottom: -20,
  },
}));
