import { useObserve } from 'expo-observe';
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import FormGroup from '../../components/ui/FormGroup';
import FormLabel from '../../components/ui/FormLabel';
import { routes } from '../../lib/routes';
import { generateSampleTasks } from '../../lib/sampleTasks';
import { ThemeMode } from '../../stores/settings';
import { useTasksStore } from '../../stores/tasks';
import EventInspectorModal from './EventInspectorModal';
import { useSettings } from './useSettings';

const SECRET_TAP_COUNT = 3;
const SECRET_TAP_TIMEOUT = 1500;

interface AppearanceOption {
  value: ThemeMode;
  label: string;
  symbol: Parameters<typeof SymbolView>[0]['name'];
}

const APPEARANCE: AppearanceOption[] = [
  { value: 'system', label: 'Follow System', symbol: 'gearshape.fill' },
  { value: 'light', label: 'Light', symbol: 'sun.max.fill' },
  { value: 'dark', label: 'Dark', symbol: 'moon.fill' },
];

export default function SettingsScreen() {
  const { theme, rt } = useUnistyles();
  const {
    router,
    themeMode,
    setThemeMode,
    weekStartsOnMonday,
    setWeekStartsOnMonday,
    taskCount,
    archivedCount,
    version,
    buildNumber,
    handleExport,
    handleImport,
    handleRate,
  } = useSettings();

  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  const [inspectorOpen, setInspectorOpen] = useState(false);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const replaceAll = useTasksStore(s => s.replaceAll);
  const handleLoadSampleData = () => {
    replaceAll(generateSampleTasks());
  };

  const onVersionTap = () => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    if (tapCountRef.current >= SECRET_TAP_COUNT) {
      tapCountRef.current = 0;
      setInspectorOpen(true);
      return;
    }
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, SECRET_TAP_TIMEOUT);
  };

  return (
    <View style={[styles.root, { paddingTop: rt.insets.top }]}>
      <View style={styles.nav}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <SymbolView
            name="chevron.left"
            size={18}
            tintColor={theme.colors.blue}
            resizeMode="scaleAspectFit"
            fallback={null}
          />
          <Text style={styles.backText}>Tasks</Text>
        </Pressable>
      </View>
      <Text style={styles.title}>Settings</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        <FormLabel>Appearance</FormLabel>
        <FormGroup>
          {APPEARANCE.map((opt, i) => {
            const selected = themeMode === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => setThemeMode(opt.value)}
                style={[
                  styles.row,
                  i > 0 && {
                    borderTopWidth: 0.5,
                    borderTopColor: theme.colors.sepSubtle,
                  },
                ]}
              >
                <SymbolView
                  name={opt.symbol}
                  size={20}
                  tintColor={theme.colors.label2}
                  resizeMode="scaleAspectFit"
                  fallback={null}
                />
                <Text style={styles.rowLabel}>{opt.label}</Text>
                {selected && (
                  <SymbolView
                    name="checkmark"
                    size={18}
                    tintColor={theme.colors.blue}
                    resizeMode="scaleAspectFit"
                    fallback={null}
                  />
                )}
              </Pressable>
            );
          })}
        </FormGroup>

        <FormLabel>Calendar</FormLabel>
        <FormGroup>
          <Pressable
            onPress={() => setWeekStartsOnMonday(!weekStartsOnMonday)}
            style={styles.row}
          >
            <SymbolView
              name="calendar"
              size={20}
              tintColor={theme.colors.label2}
              resizeMode="scaleAspectFit"
              fallback={null}
            />
            <Text style={styles.rowLabel}>Start week on Monday</Text>
            <Switch
              value={weekStartsOnMonday}
              onValueChange={setWeekStartsOnMonday}
            />
          </Pressable>
        </FormGroup>

        <FormLabel>Tasks</FormLabel>
        <FormGroup>
          <Pressable
            onPress={() => router.push(routes.archived)}
            style={styles.row}
          >
            <SymbolView
              name="archivebox"
              size={20}
              tintColor={theme.colors.label2}
              resizeMode="scaleAspectFit"
              fallback={null}
            />
            <Text style={styles.rowLabel}>Archived tasks</Text>
            {archivedCount > 0 && (
              <Text style={styles.rowValue}>{archivedCount}</Text>
            )}
            <SymbolView
              name="chevron.right"
              size={14}
              tintColor={theme.colors.label4}
              resizeMode="scaleAspectFit"
              fallback={null}
            />
          </Pressable>
        </FormGroup>

        <FormLabel>Home Screen Widget</FormLabel>
        <FormGroup>
          <Pressable
            onPress={() => router.push(routes.onboarding)}
            style={styles.row}
          >
            <SymbolView
              name="square.grid.2x2.fill"
              size={20}
              tintColor={theme.colors.blue}
              resizeMode="scaleAspectFit"
              fallback={null}
            />
            <Text style={styles.rowLabel}>Set up the widget</Text>
            <SymbolView
              name="chevron.right"
              size={14}
              tintColor={theme.colors.label4}
              resizeMode="scaleAspectFit"
              fallback={null}
            />
          </Pressable>
        </FormGroup>

        <FormLabel>Data</FormLabel>
        <FormGroup>
          <Pressable onPress={handleExport} style={styles.row}>
            <SymbolView
              name="arrow.up"
              size={20}
              tintColor={theme.colors.label2}
              resizeMode="scaleAspectFit"
              fallback={null}
            />
            <Text style={styles.rowLabel}>Export all tasks</Text>
            <Text style={styles.rowValue}>
              {taskCount} task{taskCount === 1 ? '' : 's'}
            </Text>
            <SymbolView
              name="chevron.right"
              size={14}
              tintColor={theme.colors.label4}
              resizeMode="scaleAspectFit"
              fallback={null}
            />
          </Pressable>
          <View style={styles.inset} />
          <Pressable onPress={handleImport} style={styles.row}>
            <SymbolView
              name="arrow.down"
              size={20}
              tintColor={theme.colors.label2}
              resizeMode="scaleAspectFit"
              fallback={null}
            />
            <Text style={styles.rowLabel}>Import from file</Text>
            <SymbolView
              name="chevron.right"
              size={14}
              tintColor={theme.colors.label4}
              resizeMode="scaleAspectFit"
              fallback={null}
            />
          </Pressable>
          {__DEV__ && (
            <>
              <View style={styles.inset} />
              <Pressable onPress={handleLoadSampleData} style={styles.row}>
                <SymbolView
                  name="wand.and.stars"
                  size={20}
                  tintColor={theme.colors.label2}
                  resizeMode="scaleAspectFit"
                  fallback={null}
                />
                <Text style={styles.rowLabel}>Load sample data</Text>
              </Pressable>
            </>
          )}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Data is stored on your device only.
            </Text>
          </View>
        </FormGroup>

        <FormLabel>About</FormLabel>
        <FormGroup>
          <Pressable
            onPress={() => router.push(routes.feedback)}
            style={styles.row}
          >
            <View
              style={[
                styles.rowIcon,
                { backgroundColor: theme.colors.blue + '22' },
              ]}
            >
              <SymbolView
                name="bubble.left.fill"
                size={15}
                tintColor={theme.colors.blue}
                resizeMode="scaleAspectFit"
                fallback={null}
              />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>
                Feedback &amp; feature requests
              </Text>
              <Text style={styles.rowSub}>Tell us what to build next</Text>
            </View>
            <SymbolView
              name="chevron.right"
              size={14}
              tintColor={theme.colors.label4}
              resizeMode="scaleAspectFit"
              fallback={null}
            />
          </Pressable>
          <View style={styles.inset} />
          <Pressable onPress={handleRate} style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#FF950029' }]}>
              <SymbolView
                name="star.fill"
                size={15}
                tintColor="#FF9500"
                resizeMode="scaleAspectFit"
                fallback={null}
              />
            </View>
            <Text style={[styles.rowLabel, { marginLeft: 0 }]}>
              Rate on the App Store
            </Text>
            <SymbolView
              name="chevron.right"
              size={14}
              tintColor={theme.colors.label4}
              resizeMode="scaleAspectFit"
              fallback={null}
            />
          </Pressable>
          <View style={styles.inset} />
          <Pressable onPress={onVersionTap} style={styles.row}>
            <Text style={[styles.rowLabel, { marginLeft: 0 }]}>Version</Text>
            <Text style={styles.rowValue}>
              {version} ({buildNumber})
            </Text>
          </Pressable>
        </FormGroup>
      </ScrollView>
      <EventInspectorModal
        visible={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    padding: 4,
  },
  backText: {
    color: theme.colors.blue,
    fontSize: 17,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 0.37,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },
  scroll: {
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  rowIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: {
    flex: 1,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  rowSub: {
    fontSize: 12,
    color: theme.colors.label3,
    marginTop: 1,
  },
  rowValue: {
    fontSize: 14,
    color: theme.colors.label3,
  },
  inset: {
    height: 0.5,
    backgroundColor: theme.colors.sepSubtle,
    marginLeft: 48,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.sepSubtle,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.label3,
  },
}));
