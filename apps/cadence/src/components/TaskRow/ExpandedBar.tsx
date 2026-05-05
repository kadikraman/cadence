import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import InlineActionBtn from '../InlineActionBtn';
import type { TaskRowActions } from './types';

interface ExpandedBarProps {
  actions: TaskRowActions;
}

export default function ExpandedBar({ actions }: ExpandedBarProps) {
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
        onPress={actions.quickDone}
      />
      <InlineActionBtn
        label="Pick date"
        symbol="calendar"
        onPress={actions.pickDate}
      />
      <InlineActionBtn label="Edit" symbol="pencil" onPress={actions.edit} />
      <InlineActionBtn
        label="History"
        symbol="clock.fill"
        onPress={actions.openHistory}
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
