import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons/static';

interface AndroidSettingsRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  trailing?: ReactNode;
  last?: boolean;
}

export default function AndroidSettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  trailing,
  last,
}: AndroidSettingsRowProps) {
  const { theme } = useUnistyles();
  return (
    <Pressable
      onPress={onPress}
      android_ripple={
        onPress ? { color: theme.colors.fill2, borderless: false } : undefined
      }
      style={[
        styles.row,
        !last && {
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={22}
        color={theme.colors.label2}
      />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.colors.label2 }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {trailing}
    </Pressable>
  );
}

const styles = StyleSheet.create(() => ({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minHeight: 56,
  },
  title: {
    fontSize: 16,
    letterSpacing: 0.15,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
}));
