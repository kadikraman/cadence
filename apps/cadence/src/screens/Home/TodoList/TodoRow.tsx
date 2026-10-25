import { memo } from 'react';
import { Text, View } from 'react-native';
import Animated, { LayoutAnimationConfig } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import SwipeRow from '../../../components/SwipeRow';
import UiSymbol from '../../../components/ui/UiSymbol';
import { checkEntering, todoEntering, todoExiting, todoLayout } from './motion';
import type { TodoRowProps } from './types';

function TodoRow({ todo, checked, last, callbacks }: TodoRowProps) {
  const { theme } = useUnistyles();
  return (
    <Animated.View
      layout={todoLayout}
      entering={todoEntering}
      exiting={todoExiting}
    >
      <SwipeRow
        onTap={() => callbacks.onToggle(todo)}
        rightActions={[
          {
            label: 'Delete',
            symbol: 'trash.fill',
            color: theme.colors.error,
            onPress: () => callbacks.onDelete(todo),
          },
        ]}
      >
        <View
          style={styles.row}
          accessibilityRole="checkbox"
          accessibilityState={{ checked }}
        >
          <LayoutAnimationConfig skipEntering>
            {checked ? (
              <Animated.View entering={checkEntering}>
                <UiSymbol
                  name="checkmark.circle.fill"
                  size={24}
                  color={theme.colors.success}
                />
              </Animated.View>
            ) : (
              <View style={styles.circle} />
            )}
          </LayoutAnimationConfig>
          <Text style={[styles.title, checked && styles.titleDone]}>
            {todo.title}
          </Text>
        </View>
      </SwipeRow>
      {!last && <View style={styles.separator} />}
    </Animated.View>
  );
}

export default memo(TodoRow);

const styles = StyleSheet.create(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    minHeight: 50,
    paddingVertical: 13,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.label4,
  },
  title: {
    flex: 1,
    fontSize: 17,
    letterSpacing: -0.4,
    color: theme.colors.text,
  },
  titleDone: {
    color: theme.colors.label3,
    textDecorationLine: 'line-through',
  },
  separator: {
    height: 0.5,
    backgroundColor: theme.colors.sepSubtle,
    marginLeft: 54,
  },
}));
