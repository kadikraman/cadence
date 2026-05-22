import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons/static';

type Variant = 'large' | 'small';

interface TopAppBarProps {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  subtitle?: string;
  variant?: Variant;
  backIcon?: string;
  backLabel?: string;
}

export default function TopAppBar({
  title,
  onBack,
  right,
  subtitle,
  variant = 'large',
  backIcon = 'chevron-left',
  backLabel = 'Back',
}: TopAppBarProps) {
  const { theme } = useUnistyles();
  const isSmall = variant === 'small';

  return (
    <View style={isSmall ? styles.smallWrapper : styles.wrapper}>
      <View style={[styles.bar, isSmall && styles.smallBar]}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel={backLabel}
            android_ripple={{
              color: theme.colors.fill2,
              borderless: true,
              radius: 24,
            }}
            style={styles.back}
          >
            <MaterialCommunityIcons
              name={backIcon}
              size={26}
              color={theme.colors.text}
            />
          </Pressable>
        ) : (
          <View style={styles.back} />
        )}
        {isSmall ? (
          <Text
            numberOfLines={1}
            style={[styles.smallTitle, { color: theme.colors.text }]}
          >
            {title}
          </Text>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        {right}
      </View>
      {!isSmall && (
        <>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.colors.label2 }]}>
              {subtitle}
            </Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create(() => ({
  wrapper: {
    paddingBottom: 12,
  },
  smallWrapper: {
    paddingBottom: 0,
  },
  bar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 4,
  },
  smallBar: {
    height: 64,
    paddingRight: 8,
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
  smallTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '500',
    letterSpacing: 0,
    paddingHorizontal: 4,
  },
}));
