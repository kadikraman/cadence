import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { Task } from '../../lib/types';
import InlineActionBtn from '../InlineActionBtn';
import type { TaskRowCallbacks } from './types';

interface ExpandedBarProps {
  task: Task;
  callbacks: TaskRowCallbacks;
}

export default function ExpandedBar({ task, callbacks }: ExpandedBarProps) {
  const { theme } = useUnistyles();
  return (
    <Animated.View
      entering={FadeIn.duration(160)}
      exiting={FadeOut.duration(120)}
      style={styles.bar}
    >
      <InlineActionBtn
        label="Done today"
        symbol="checkmark"
        color={theme.colors.success}
        onPress={() => callbacks.onQuickDone(task)}
      />
      <InlineActionBtn
        label="Pick date"
        symbol="calendar"
        onPress={() => callbacks.onPickDate(task)}
      />
      <InlineActionBtn
        label="Edit"
        symbol="pencil"
        onPress={() => callbacks.onEdit(task)}
      />
      <InlineActionBtn
        label="History"
        symbol="clock.fill"
        onPress={() => callbacks.onOpenHistory(task)}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create(theme => ({
  bar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.sepSubtle,
    marginTop: -2,
  },
}));
