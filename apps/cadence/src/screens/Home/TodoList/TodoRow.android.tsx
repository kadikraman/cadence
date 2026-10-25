import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons/static';
import { memo } from 'react';
import { Text, View } from 'react-native';
import Animated, { LayoutAnimationConfig } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import SwipeRow from '../../../components/SwipeRow';
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
        backgroundColor={theme.colors.surfaceElevated}
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
          <View style={styles.checkArea}>
            <LayoutAnimationConfig skipEntering>
              {checked ? (
                <Animated.View entering={checkEntering} style={styles.checked}>
                  <MaterialCommunityIcons
                    name="check"
                    size={16}
                    color={theme.colors.onPrimary}
                  />
                </Animated.View>
              ) : (
                <View style={styles.circle} />
              )}
            </LayoutAnimationConfig>
          </View>
          <Text style={[styles.title, checked && styles.titleDone]}>
            {todo.title}
          </Text>
        </View>
      </SwipeRow>
      {!last && <View style={styles.divider} />}
    </Animated.View>
  );
}

export default memo(TodoRow);

const styles = StyleSheet.create(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 10,
    paddingRight: 16,
    minHeight: 56,
    paddingVertical: 8,
  },
  checkArea: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.label2,
  },
  checked: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  title: {
    flex: 1,
    fontSize: 16,
    letterSpacing: 0.15,
    color: theme.colors.text,
  },
  titleDone: {
    color: theme.colors.label3,
    textDecorationLine: 'line-through',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.sepSubtle,
    marginLeft: 58,
  },
}));
