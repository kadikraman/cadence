import * as Sentry from '@sentry/react-native';
import * as Application from 'expo-application';
import { useRouter } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import { Alert, Linking } from 'react-native';
import { exportTasks, importTasks } from '../../lib/exportImport';
import { logs } from '../../lib/logs';
import { ThemeMode, useSettingsStore } from '../../stores/settings';
import { useTasksStore } from '../../stores/tasks';


export function useSettings() {
  const router = useRouter();
  const themeMode = useSettingsStore(s => s.themeMode);
  const setThemeModeStore = useSettingsStore(s => s.setThemeMode);
  const weekStartsOnMonday = useSettingsStore(s => s.weekStartsOnMonday);
  const setWeekStartsOnMonday = useSettingsStore(s => s.setWeekStartsOnMonday);
  const taskCount = useTasksStore(s => s.tasks.length);
  const version = Application.nativeApplicationVersion || "Unknown";
  const buildNumber = Application.nativeBuildVersion || "Unknown";

  const setThemeMode = (mode: ThemeMode) => setThemeModeStore(mode);

  const handleExport = async () => {
    try {
      await exportTasks();
      logs.settingsExportCompleted();
    } catch (err) {
      Alert.alert('Export failed', String(err));
      logs.settingsExportFailed(err);
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
        logs.settingsImportCompleted();
      }
    } catch (err) {
      Alert.alert('Import failed', String(err));
      logs.settingsImportFailed(err);
    }
  };

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
      Sentry.captureException(err);
      logs.settingsRateFailed(err);
    }
  };

  return {
    router,
    themeMode,
    setThemeMode,
    weekStartsOnMonday,
    setWeekStartsOnMonday,
    taskCount,
    version,
    buildNumber,
    handleExport,
    handleImport,
    handleRate,
  };
}
