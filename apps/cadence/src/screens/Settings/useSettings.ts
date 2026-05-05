import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import { Alert, Linking } from 'react-native';
import { exportTasks, importTasks } from '../../lib/exportImport';
import { useSettingsStore } from '../../stores/settings';
import { useTasksStore } from '../../stores/tasks';

export function useSettings() {
  const router = useRouter();
  const themeMode = useSettingsStore(s => s.themeMode);
  const setThemeMode = useSettingsStore(s => s.setThemeMode);
  const taskCount = useTasksStore(s => s.tasks.length);
  const version = Constants.expoConfig?.version ?? '1.0';

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

  return {
    router,
    themeMode,
    setThemeMode,
    taskCount,
    version,
    handleExport,
    handleImport,
    handleRate,
  };
}
