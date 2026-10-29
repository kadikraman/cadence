import { Pressable, Text, TextInput, View } from 'react-native';
import Animated, { LayoutAnimationConfig } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import UiSymbol from '../../../components/ui/UiSymbol';
import ClearDoneButton from './ClearDoneButton';
import { todoEntering, todoExiting, todoLayout } from './motion';
import TodoRow from './TodoRow';
import type { TodoListProps } from './types';
import { useTodoList } from './useTodoList';

export type { TodoListProps, TodoRowCallbacks } from './types';

export default function TodoList({ inputRef, header }: TodoListProps) {
  const { theme } = useUnistyles();
  const {
    isEmpty,
    open,
    done,
    pendingIds,
    draft,
    setDraft,
    submit,
    doneExpanded,
    toggleDoneExpanded,
    clearDoneItems,
    callbacks,
  } = useTodoList();

  return (
    <LayoutAnimationConfig skipEntering skipExiting>
      <Animated.ScrollView
        style={styles.root}
        contentContainerStyle={styles.scroll}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        {header}
        <View style={styles.quickAdd}>
          <UiSymbol name="plus" size={20} color={theme.colors.blue} />
          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={setDraft}
            placeholder="Add a to-do"
            placeholderTextColor={theme.colors.label3}
            returnKeyType="done"
            submitBehavior="submit"
            onSubmitEditing={() => {
              if (!submit()) inputRef.current?.blur();
            }}
            style={styles.input}
          />
        </View>

        {isEmpty ? (
          <Animated.View
            entering={todoEntering}
            exiting={todoExiting}
            style={styles.empty}
          >
            <View style={styles.emptyIcon}>
              <UiSymbol name="arrow.up" size={20} color={theme.colors.blue} />
            </View>
            <Text style={styles.emptyTitle}>Add your first to-do</Text>
            <Text style={styles.emptyBody}>
              Type it above and press return. This list is for one-off things
              that don&apos;t repeat.
            </Text>
          </Animated.View>
        ) : (
          <>
            {open.length > 0 && (
              <Animated.View
                layout={todoLayout}
                entering={todoEntering}
                exiting={todoExiting}
                style={styles.section}
              >
                <View style={styles.sectionHeader}>
                  <View
                    style={[styles.dot, { backgroundColor: theme.colors.blue }]}
                  />
                  <Text style={styles.sectionLabel}>Open</Text>
                  <Text style={styles.sectionCount}>{open.length}</Text>
                </View>
                <Animated.View layout={todoLayout} style={styles.card}>
                  {open.map((todo, i) => (
                    <TodoRow
                      key={todo.id}
                      todo={todo}
                      checked={pendingIds.has(todo.id)}
                      last={i === open.length - 1}
                      callbacks={callbacks}
                    />
                  ))}
                </Animated.View>
              </Animated.View>
            )}
            {done.length > 0 && (
              <Animated.View
                layout={todoLayout}
                entering={todoEntering}
                exiting={todoExiting}
                style={styles.section}
              >
                <View style={styles.sectionHeader}>
                  <Pressable
                    onPress={toggleDoneExpanded}
                    style={styles.doneToggle}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: doneExpanded }}
                  >
                    <View
                      style={[
                        styles.dot,
                        { backgroundColor: theme.colors.success },
                      ]}
                    />
                    <Text style={styles.sectionLabel}>Done</Text>
                    <Text style={styles.sectionCount}>{done.length}</Text>
                    <UiSymbol
                      name={doneExpanded ? 'chevron.down' : 'chevron.right'}
                      size={11}
                      color={theme.colors.label3}
                    />
                  </Pressable>
                  <ClearDoneButton
                    count={done.length}
                    onConfirm={clearDoneItems}
                  />
                </View>
                {doneExpanded && (
                  <Animated.View layout={todoLayout} style={styles.card}>
                    {done.map((todo, i) => (
                      <TodoRow
                        key={todo.id}
                        todo={todo}
                        checked
                        last={i === done.length - 1}
                        callbacks={callbacks}
                      />
                    ))}
                  </Animated.View>
                )}
              </Animated.View>
            )}
          </>
        )}
      </Animated.ScrollView>
    </LayoutAnimationConfig>
  );
}

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
  },
  quickAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceElevated,
  },
  input: {
    flex: 1,
    fontSize: 17,
    letterSpacing: -0.4,
    color: theme.colors.text,
  },
  scroll: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  doneToggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.label2,
    textTransform: 'uppercase',
    letterSpacing: -0.1,
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.label3,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 16,
    overflow: 'hidden',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 44,
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.blue + '1A',
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.4,
    color: theme.colors.text,
  },
  emptyBody: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
    color: theme.colors.label3,
  },
}));
