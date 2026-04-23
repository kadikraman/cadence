import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  flush?: boolean;
}

export default function SectionCard({
  title,
  subtitle,
  children,
  flush,
}: SectionCardProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.headerWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={[styles.card, flush && styles.cardFlush]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  wrap: {
    marginHorizontal: 16,
    marginBottom: 14,
  },
  headerWrap: {
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  title: {
    fontSize: 13,
    color: theme.colors.label2,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: -0.08,
  },
  subtitle: {
    fontSize: 11,
    color: theme.colors.label3,
    marginTop: 1,
  },
  card: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 16,
    padding: 14,
  },
  cardFlush: {
    padding: 0,
  },
}));
