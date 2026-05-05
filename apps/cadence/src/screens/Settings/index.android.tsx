import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TopAppBar from '../../components/ui/android/TopAppBar';
import { ThemeMode } from '../../stores/settings';
import { useSettings } from './useSettings';

interface AppearanceOption {
  value: ThemeMode;
  label: string;
  materialIcon: string;
}

const APPEARANCE: AppearanceOption[] = [
  { value: 'system', label: 'System default', materialIcon: 'cog' },
  { value: 'light', label: 'Light', materialIcon: 'white-balance-sunny' },
  { value: 'dark', label: 'Dark', materialIcon: 'weather-night' },
];

export default function SettingsScreen() {
  const { theme, rt } = useUnistyles();
  const {
    router,
    themeMode,
    setThemeMode,
    taskCount,
    version,
    handleExport,
    handleImport,
    handleRate,
  } = useSettings();

  return (
    <View style={[styles.root, { paddingTop: rt.insets.top }]}>
      <TopAppBar title="Settings" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Group title="Appearance">
          {APPEARANCE.map((opt, i) => {
            const selected = themeMode === opt.value;
            return (
              <Row
                key={opt.value}
                icon={opt.materialIcon}
                title={opt.label}
                onPress={() => setThemeMode(opt.value)}
                last={i === APPEARANCE.length - 1}
                trailing={
                  selected ? (
                    <MaterialCommunityIcons
                      name="check"
                      size={22}
                      color={theme.colors.primary}
                    />
                  ) : null
                }
              />
            );
          })}
        </Group>

        <Group title="Home screen widget">
          <Row
            icon="apps"
            title="Set up the widget"
            subtitle="Pin Cadence to your home screen"
            onPress={() => router.push('/onboarding')}
            trailing={
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color={theme.colors.label3}
              />
            }
            last
          />
        </Group>

        <Group title="Data">
          <Row
            icon="arrow-up"
            title="Export all tasks"
            subtitle={`${taskCount} task${taskCount === 1 ? '' : 's'}`}
            onPress={handleExport}
            trailing={
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color={theme.colors.label3}
              />
            }
          />
          <Row
            icon="arrow-down"
            title="Import from file"
            onPress={handleImport}
            trailing={
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color={theme.colors.label3}
              />
            }
            last
          />
        </Group>

        <Group title="About">
          <Row
            icon="message-text"
            title="Feedback & feature requests"
            subtitle="Tell us what to build next"
            onPress={() => router.push('/feedback')}
            trailing={
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color={theme.colors.label3}
              />
            }
          />
          <Row
            icon="star"
            title="Rate on Google Play"
            onPress={handleRate}
            trailing={
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color={theme.colors.label3}
              />
            }
          />
          <Row
            icon="information-outline"
            title="Version"
            trailing={
              <Text style={[styles.version, { color: theme.colors.label2 }]}>
                {version}
              </Text>
            }
            last
          />
        </Group>
      </ScrollView>
    </View>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { theme } = useUnistyles();
  return (
    <View style={styles.group}>
      <Text style={[styles.groupLabel, { color: theme.colors.primary }]}>
        {title}
      </Text>
      <View
        style={[
          styles.groupBody,
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

interface RowProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  last?: boolean;
}

function Row({ icon, title, subtitle, onPress, trailing, last }: RowProps) {
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
        <Text style={[styles.rowTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.rowSubtitle, { color: theme.colors.label2 }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {trailing}
    </Pressable>
  );
}

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  group: {
    marginBottom: 20,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 8,
  },
  groupBody: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minHeight: 56,
  },
  rowTitle: {
    fontSize: 16,
    letterSpacing: 0.15,
  },
  rowSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  version: {
    fontSize: 13,
  },
}));
