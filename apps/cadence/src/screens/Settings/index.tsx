import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import { SymbolView } from 'expo-symbols';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FormGroup from '../../components/ui/FormGroup';
import FormLabel from '../../components/ui/FormLabel';
import TopAppBar from '../../components/ui/android/TopAppBar';
import { useTheme } from '../../contexts/ThemeContext';
import { exportTasks, importTasks } from '../../lib/exportImport';
import { useTasksStore } from '../../stores/tasks';

type ThemeMode = 'system' | 'light' | 'dark';

const IS_ANDROID = Platform.OS === 'android';

interface AppearanceOption {
  value: ThemeMode;
  label: string;
  symbol: Parameters<typeof SymbolView>[0]['name'];
  materialIcon: string;
}

const APPEARANCE: AppearanceOption[] = [
  {
    value: 'system',
    label: IS_ANDROID ? 'System default' : 'Follow System',
    symbol: 'gearshape.fill',
    materialIcon: 'cog',
  },
  {
    value: 'light',
    label: 'Light',
    symbol: 'sun.max.fill',
    materialIcon: 'white-balance-sunny',
  },
  {
    value: 'dark',
    label: 'Dark',
    symbol: 'moon.fill',
    materialIcon: 'weather-night',
  },
];

export default function SettingsScreen() {
  const { theme, rt } = useUnistyles();
  const router = useRouter();
  const { themeMode, setThemeMode } = useTheme();
  const taskCount = useTasksStore(s => s.tasks.length);

  const handleExport = async () => {
    try {
      await exportTasks();
    } catch (err) {
      Alert.alert('Export failed', String(err));
    }
  };

  const handleImport = async () => {
    try {
      const res = await importTasks();
      if (res) {
        Alert.alert(
          'Import complete',
          `${res.imported} imported${res.skipped > 0 ? `, ${res.skipped} skipped` : ''}.`
        );
      }
    } catch (err) {
      Alert.alert('Import failed', String(err));
    }
  };

  const version = Constants.expoConfig?.version ?? '1.0';

  const handleRate = async () => {
    try {
      const available = await StoreReview.isAvailableAsync();
      if (available && (await StoreReview.hasAction())) {
        await StoreReview.requestReview();
        return;
      }
      const url = await StoreReview.storeUrl();
      if (url) {
        await Linking.openURL(url);
      }
    } catch (err) {
      console.warn('rate failed', err);
    }
  };

  if (IS_ANDROID) {
    return (
      <View style={[styles.root, { paddingTop: rt.insets.top }]}>
        <TopAppBar title="Settings" onBack={() => router.back()} />
        <ScrollView contentContainerStyle={styles.androidScroll}>
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

          <AndroidGroup title="Home screen widget">
            <AndroidSettingsRow
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
              last
            />
          </AndroidGroup>

          <AndroidGroup title="About">
            <AndroidSettingsRow
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
                <Text
                  style={[
                    styles.androidVersion,
                    { color: theme.colors.label2 },
                  ]}
                >
                  {version}
                </Text>
              }
              last
            />
          </AndroidGroup>
        </ScrollView>
      </View>
    );
  }

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

        <FormLabel>Home Screen Widget</FormLabel>
        <FormGroup>
          <Pressable
            onPress={() => router.push('/onboarding')}
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
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Data is stored on your device only.
            </Text>
          </View>
        </FormGroup>

        <FormLabel>About</FormLabel>
        <FormGroup>
          <Pressable
            onPress={() => router.push('/feedback')}
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
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { marginLeft: 0 }]}>Version</Text>
            <Text style={styles.rowValue}>{version}</Text>
          </View>
        </FormGroup>
      </ScrollView>
    </View>
  );
}

function AndroidGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { theme } = useUnistyles();
  return (
    <View style={styles.androidGroup}>
      <Text style={[styles.androidGroupLabel, { color: theme.colors.primary }]}>
        {title}
      </Text>
      <View
        style={[
          styles.androidGroupBody,
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

interface AndroidRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  last?: boolean;
}

function AndroidSettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  trailing,
  last,
}: AndroidRowProps) {
  const { theme } = useUnistyles();
  return (
    <Pressable
      onPress={onPress}
      android_ripple={
        onPress ? { color: theme.colors.fill2, borderless: false } : undefined
      }
      style={[
        styles.androidRow,
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
        <Text style={[styles.androidRowTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.androidRowSubtitle, { color: theme.colors.label2 }]}
          >
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
  androidScroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  androidGroup: {
    marginBottom: 20,
  },
  androidGroupLabel: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 8,
  },
  androidGroupBody: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  androidRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minHeight: 56,
  },
  androidRowTitle: {
    fontSize: 16,
    letterSpacing: 0.15,
  },
  androidRowSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  androidVersion: {
    fontSize: 13,
  },
}));
