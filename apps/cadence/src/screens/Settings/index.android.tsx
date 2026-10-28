import { useObserve } from 'expo-observe';
import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons/static';
import TopAppBar from '../../components/ui/android/TopAppBar';
import NativeSwitch from '../../components/ui/NativeSwitch';
import { routes } from '../../lib/routes';
import { SYNC_PROVIDER_NAME } from '../../lib/sync/useSyncSetting';
import { ThemeMode } from '../../stores/settings';
import AndroidGroup from './AndroidGroup';
import AndroidSettingsRow from './AndroidSettingsRow';
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
    weekStartsOnMonday,
    setWeekStartsOnMonday,
    todosEnabled,
    setTodosEnabled,
    sync,
    taskCount,
    archivedCount,
    version,
    buildNumber,
    handleExport,
    handleImport,
    handleRate,
    handleLoadSampleData,
  } = useSettings();

  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  return (
    <View style={[styles.root, { paddingTop: rt.insets.top }]}>
      <TopAppBar title="Settings" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <AndroidGroup title="Appearance">
          {APPEARANCE.map((opt, i) => {
            const selected = themeMode === opt.value;
            return (
              <AndroidSettingsRow
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
        </AndroidGroup>

        <AndroidGroup title="Features">
          <AndroidSettingsRow
            icon="format-list-checks"
            title="To-do list"
            subtitle="Adds a To do tab for one-off items"
            onPress={() => setTodosEnabled(!todosEnabled)}
            trailing={
              <NativeSwitch
                value={todosEnabled}
                onValueChange={setTodosEnabled}
              />
            }
            last
          />
        </AndroidGroup>

        <AndroidGroup title="Sync">
          <AndroidSettingsRow
            icon="google-drive"
            title={`Sync with ${SYNC_PROVIDER_NAME}`}
            subtitle={
              sync.enabled && sync.account
                ? `${sync.account}\n${sync.statusText}`
                : sync.statusText
            }
            onPress={() => sync.setEnabled(!sync.enabled)}
            trailing={
              <NativeSwitch
                value={sync.enabled}
                onValueChange={sync.setEnabled}
              />
            }
            last
          />
        </AndroidGroup>

        <AndroidGroup title="Calendar">
          <AndroidSettingsRow
            icon="calendar"
            title="Start week on Monday"
            onPress={() => setWeekStartsOnMonday(!weekStartsOnMonday)}
            trailing={
              <NativeSwitch
                value={weekStartsOnMonday}
                onValueChange={setWeekStartsOnMonday}
              />
            }
            last
          />
        </AndroidGroup>

        <AndroidGroup title="Tasks">
          <AndroidSettingsRow
            icon="archive-outline"
            title="Archived tasks"
            subtitle={
              archivedCount > 0
                ? `${archivedCount} archived`
                : 'Hidden tasks you can restore'
            }
            onPress={() => router.push(routes.archived)}
            trailing={
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color={theme.colors.label3}
              />
            }
            last
          />
        </AndroidGroup>

        <AndroidGroup title="Home screen widget">
          <AndroidSettingsRow
            icon="apps"
            title="Set up the widget"
            subtitle="Pin Cadence to your home screen"
            onPress={() => router.push(routes.onboarding)}
            trailing={
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color={theme.colors.label3}
              />
            }
            last
          />
        </AndroidGroup>

        <AndroidGroup title="Data">
          <AndroidSettingsRow
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
          <AndroidSettingsRow
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
            last={!__DEV__}
          />
          {__DEV__ && (
            <AndroidSettingsRow
              icon="database-plus"
              title="Load sample data (screenshots)"
              subtitle="Replaces all tasks and to-dos with sample data"
              onPress={handleLoadSampleData}
              last
            />
          )}
        </AndroidGroup>

        <AndroidGroup title="About">
          <AndroidSettingsRow
            icon="message-text"
            title="Feedback & feature requests"
            subtitle="Tell us what to build next"
            onPress={() => router.push(routes.feedback)}
            trailing={
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color={theme.colors.label3}
              />
            }
          />
          <AndroidSettingsRow
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
          <AndroidSettingsRow
            icon="information-outline"
            title="Version"
            trailing={
              <Text style={[styles.version, { color: theme.colors.label2 }]}>
                {version} ({buildNumber})
              </Text>
            }
            last
          />
        </AndroidGroup>
      </ScrollView>
    </View>
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
  version: {
    fontSize: 13,
  },
}));
