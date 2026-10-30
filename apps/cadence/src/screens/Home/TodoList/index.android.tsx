import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons/static';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Animated, { LayoutAnimationConfig } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import Snackbar from '../../../components/ui/android/Snackbar';
import { todoEntering, todoExiting, todoLayout } from './motion';
import TodoRow from './TodoRow';
import type { TodoListProps } from './types';
import { useTodoList } from './useTodoList';

export type { TodoListProps, TodoRowCallbacks } from './types';

export default function TodoList({ inputRef }: TodoListProps) {
  const { theme } = useUnistyles();
  const [focused, setFocused] = useState(false);
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
    undo,
    undoRemove,
    dismissUndo,
    callbacks,
    editing,
  } = useTodoList(inputRef);

  return (
    <LayoutAnimationConfig skipEntering skipExiting>
      <View style={styles.root}>
        <View style={[styles.quickAdd, focused && styles.quickAddFocused]}>
          <MaterialCommunityIcons
            name="plus"
            size={24}
            color={theme.colors.primary}
          />
          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={setDraft}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={editing ? 'Edit to-do' : 'Add a to-do'}
            placeholderTextColor={theme.colors.label2}
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
              <MaterialCommunityIcons
                name="arrow-up"
                size={24}
                color={theme.colors.onPrimaryContainer}
              />
            </View>
            <Text style={styles.emptyTitle}>Add your first to-do</Text>
            <Text style={styles.emptyBody}>
              Type it above and press enter. This list is for one-off things
              that don&apos;t repeat.
            </Text>
          </Animated.View>
        ) : (
          <Animated.ScrollView
            entering={todoEntering}
            contentContainerStyle={styles.scroll}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
          >
            {open.length > 0 && (
              <Animated.View
                layout={todoLayout}
                entering={todoEntering}
                exiting={todoExiting}
                style={styles.section}
              >
                <View style={styles.sectionHeader}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: theme.colors.primary },
                    ]}
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
                        { backgroundColor: theme.colors.label3 },
                      ]}
                    />
                    <Text style={styles.sectionLabel}>Done</Text>
                    <Text style={styles.sectionCount}>{done.length}</Text>
                    <MaterialCommunityIcons
                      name={doneExpanded ? 'chevron-down' : 'chevron-right'}
                      size={18}
                      color={theme.colors.label3}
                    />
                  </Pressable>
                  <Pressable
                    onPress={clearDoneItems}
                    android_ripple={{ color: theme.colors.fill2 }}
                    style={styles.clearDoneBtn}
                  >
                    <Text style={styles.clearDone}>Clear done</Text>
                  </Pressable>
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
          </Animated.ScrollView>
        )}

        <Snackbar
          snackKey={undo?.key}
          message={undo?.message}
          actionLabel="Undo"
          bottomOffset={72}
          onAction={undoRemove}
          onDismiss={dismissUndo}
        />
      </View>
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
    gap: 16,
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    paddingHorizontal: 18,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: theme.colors.surfaceElevated,
  },
  quickAddFocused: {
    borderColor: theme.colors.primary,
  },
  input: {
    flex: 1,
    fontSize: 16,
    letterSpacing: 0.15,
    color: theme.colors.text,
  },
  scroll: {
    paddingBottom: 120,
  },
  section: {
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    paddingLeft: 20,
    paddingRight: 12,
  },
  doneToggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: theme.colors.label2,
    textTransform: 'uppercase',
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.label3,
  },
  clearDoneBtn: {
    height: 32,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  clearDone: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    color: theme.colors.primary,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 16,
    overflow: 'hidden',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 26,
    paddingHorizontal: 44,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryContainer,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 22,
    lineHeight: 28,
    color: theme.colors.text,
  },
  emptyBody: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    textAlign: 'center',
    color: theme.colors.label2,
  },
}));
