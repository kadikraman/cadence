import { Host } from '@expo/ui';
import { Form, Label, Picker, Section, Text, Toggle } from '@expo/ui/swift-ui';
import { labelsHidden, pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
import { useObserve } from 'expo-observe';
import { Stack } from 'expo-router';
import type { SFSymbol } from 'expo-symbols';
import { useCallback, useEffect, useRef } from 'react';
import { useUnistyles } from 'react-native-unistyles';
import { routes } from '../../lib/routes';
import { SYNC_PROVIDER_NAME } from '../../lib/sync/useSyncSetting';
import { ThemeMode } from '../../stores/settings';
import LinkRow from './LinkRow';
import { useSettings } from './useSettings';

const SECRET_TAP_COUNT = 3;
const SECRET_TAP_TIMEOUT = 1500;
const STAR_ORANGE = '#FF9500';

interface AppearanceOption {
  value: ThemeMode;
  label: string;
  symbol: SFSymbol;
}

const APPEARANCE: AppearanceOption[] = [
  { value: 'system', label: 'Follow System', symbol: 'gearshape.fill' },
  { value: 'light', label: 'Light', symbol: 'sun.max.fill' },
  { value: 'dark', label: 'Dark', symbol: 'moon.fill' },
];

export default function SettingsScreen() {
  const { theme } = useUnistyles();
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

  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onVersionTap = useCallback(() => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    if (tapCountRef.current >= SECRET_TAP_COUNT) {
      tapCountRef.current = 0;
      router.push(routes.eventInspector);
      return;
    }
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, SECRET_TAP_TIMEOUT);
  }, [router]);

  return (
    <>
      <Stack.Title large>Settings</Stack.Title>
      <Host style={{ flex: 1 }}>
        <Form>
          <Section title="Appearance">
            <Picker
              label="Appearance"
              selection={themeMode}
              onSelectionChange={setThemeMode}
              modifiers={[pickerStyle('inline'), labelsHidden()]}
            >
              {APPEARANCE.map(opt => (
                <Label
                  key={opt.value}
                  title={opt.label}
                  systemImage={opt.symbol}
                  modifiers={[tag(opt.value)]}
                />
              ))}
            </Picker>
          </Section>

          <Section
            title="Features"
            footer={<Text>Adds a To do tab for one-off items.</Text>}
          >
            <Toggle
              label="To-do list"
              systemImage="checklist"
              isOn={todosEnabled}
              onIsOnChange={setTodosEnabled}
            />
          </Section>

          <Section title="Sync" footer={<Text>{sync.statusText}</Text>}>
            <Toggle
              label={`Sync with ${SYNC_PROVIDER_NAME}`}
              systemImage="icloud.fill"
              isOn={sync.enabled}
              onIsOnChange={sync.setEnabled}
            />
          </Section>

          <Section title="Calendar">
            <Toggle
              label="Start week on Monday"
              systemImage="calendar"
              isOn={weekStartsOnMonday}
              onIsOnChange={setWeekStartsOnMonday}
            />
          </Section>

          <Section title="Tasks">
            <LinkRow
              title="Archived tasks"
              symbol="archivebox"
              symbolColor={theme.colors.blue}
              value={archivedCount > 0 ? String(archivedCount) : undefined}
              onPress={() => router.push(routes.archived)}
            />
          </Section>

          <Section title="Home Screen Widget">
            <LinkRow
              title="Set up the widget"
              symbol="square.grid.2x2.fill"
              symbolColor={theme.colors.blue}
              onPress={() => router.push(routes.onboarding)}
            />
          </Section>

          <Section title="Data">
            <LinkRow
              title="Export all tasks"
              symbol="square.and.arrow.up"
              symbolColor={theme.colors.blue}
              value={`${taskCount} task${taskCount === 1 ? '' : 's'}`}
              chevron={false}
              onPress={handleExport}
            />
            <LinkRow
              title="Import from file"
              symbol="square.and.arrow.down"
              symbolColor={theme.colors.blue}
              chevron={false}
              onPress={handleImport}
            />
            {__DEV__ && (
              <LinkRow
                title="Load sample data"
                symbol="wand.and.stars"
                symbolColor={theme.colors.blue}
                chevron={false}
                onPress={handleLoadSampleData}
              />
            )}
          </Section>

          <Section title="About">
            <LinkRow
              title="Feedback & feature requests"
              symbol="bubble.left.fill"
              symbolColor={theme.colors.blue}
              onPress={() => router.push(routes.feedback)}
            />
            <LinkRow
              title="Rate on the App Store"
              symbol="star.fill"
              symbolColor={STAR_ORANGE}
              chevron={false}
              onPress={handleRate}
            />
            <LinkRow
              title="Version"
              symbol="info.circle"
              symbolColor={theme.colors.label3}
              value={`${version} (${buildNumber})`}
              chevron={false}
              onPress={onVersionTap}
            />
          </Section>
        </Form>
      </Host>
    </>
  );
}
