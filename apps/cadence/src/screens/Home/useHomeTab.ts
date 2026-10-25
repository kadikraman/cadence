import { useRef } from 'react';
import type { TextInputInstance } from 'react-native';
import { HomeTab, useSettingsStore } from '../../stores/settings';

export function useHomeTab() {
  const todosEnabled = useSettingsStore(s => s.todosEnabled);
  const homeTab = useSettingsStore(s => s.homeTab);
  const setTab = useSettingsStore(s => s.setHomeTab);
  const todoInputRef = useRef<TextInputInstance>(null);
  const tab: HomeTab = todosEnabled ? homeTab : 'tasks';

  return { todosEnabled, tab, setTab, todoInputRef };
}
