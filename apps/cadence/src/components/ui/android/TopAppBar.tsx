import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface TopAppBarProps {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  subtitle?: string;
}

export default function TopAppBar({
  title,
  onBack,
  right,
  subtitle,
}: TopAppBarProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Back"
            android_ripple={{
              color: theme.colors.fill2,
              borderless: true,
              radius: 24,
            }}
            style={styles.back}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={26}
              color={theme.colors.text}
            />
          </Pressable>
        ) : (
          <View style={styles.back} />
        )}
        <View style={{ flex: 1 }} />
        {right}
      </View>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.colors.label2 }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create(() => ({
  wrapper: {
    paddingBottom: 12,
  },
  bar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 4,
  },
  back: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  title: {
    paddingHorizontal: 20,
    paddingTop: 4,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '400',
    letterSpacing: 0,
  },
  subtitle: {
    paddingHorizontal: 20,
    paddingTop: 4,
    fontSize: 14,
    letterSpacing: 0.25,
  },
}));
