import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import * as StoreReview from 'expo-store-review';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import FormGroup from '../../components/ui/FormGroup';
import FormLabel from '../../components/ui/FormLabel';
import { useTheme } from '../../contexts/ThemeContext';
import { exportTasks, importTasks } from '../../lib/exportImport';
import { useTasksStore } from '../../stores/tasks';

type ThemeMode = 'system' | 'light' | 'dark';

const APPEARANCE: {
  value: ThemeMode;
  label: string;
  symbol: Parameters<typeof SymbolView>[0]['name'];
}[] = [
  { value: 'system', label: 'Follow System', symbol: 'gearshape.fill' },
  { value: 'light', label: 'Light', symbol: 'sun.max.fill' },
  { value: 'dark', label: 'Dark', symbol: 'moon.fill' },
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
