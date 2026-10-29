import * as Sentry from '@sentry/react-native';
import * as Application from 'expo-application';
import { useRouter } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import { Alert, Linking } from 'react-native';
import { exportTasks, importTasks } from '../../lib/exportImport';
import { logs } from '../../lib/logs';
import {
  generateSampleTasks,
  generateSampleTodos,
} from '../../lib/sampleTasks';
import { useSyncSetting } from '../../lib/sync/useSyncSetting';
import { ThemeMode, useSettingsStore } from '../../stores/settings';
import { useTasksStore } from '../../stores/tasks';
import { useTodosStore } from '../../stores/todos';

export function useSettings() {
  const router = useRouter();
  const themeMode = useSettingsStore(s => s.themeMode);
  const setThemeModeStore = useSettingsStore(s => s.setThemeMode);
  const todosEnabled = useSettingsStore(s => s.todosEnabled);
  const setTodosEnabledStore = useSettingsStore(s => s.setTodosEnabled);
  const sync = useSyncSetting();
  const replaceAllTasks = useTasksStore(s => s.replaceAll);
  const replaceAllTodos = useTodosStore(s => s.replaceAll);
  const taskCount = useTasksStore(s => s.tasks.length);
  const archivedCount = useTasksStore(
    s => s.tasks.filter(t => t.archived).length
  );
  const version = Application.nativeApplicationVersion || 'Unknown';
  const buildNumber = Application.nativeBuildVersion || 'Unknown';

  const setThemeMode = (mode: ThemeMode) => setThemeModeStore(mode);

  const setTodosEnabled = (value: boolean) => {
    logs.settingsTodosToggled();
    setTodosEnabledStore(value);
  };

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
      const res = await importTasks(sync.enabled);
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

  const handleLoadSampleData = () => {
    replaceAllTasks(generateSampleTasks());
    replaceAllTodos(generateSampleTodos());
    setTodosEnabledStore(true);
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
  };
}
