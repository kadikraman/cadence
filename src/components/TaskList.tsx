import { SymbolView } from 'expo-symbols';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Task } from '../lib/db';
import {
  isTaskDueInNext7Days,
  isTaskDueToday,
  isTaskDueTomorrow,
  sortTasksByDueDate,
} from '../utils/taskUtils';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

type FilterType = 'all' | 'due-today' | 'due-tomorrow' | 'due-week';

export default function TaskList({
  tasks,
  onComplete,
  onEdit,
  onDelete,
}: TaskListProps) {
  const [filter, setFilter] = useState<FilterType>('due-today');

  const getFilteredTasks = () => {
    const sortedTasks = sortTasksByDueDate(tasks);

    switch (filter) {
      case 'due-today':
        return sortedTasks.filter(task => isTaskDueToday(task));
      case 'due-tomorrow':
        return sortedTasks.filter(task => isTaskDueTomorrow(task));
      case 'due-week':
        return sortedTasks.filter(task => isTaskDueInNext7Days(task));
      default:
        return sortedTasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const getFilterCount = (filterType: FilterType): number => {
    switch (filterType) {
      case 'due-today':
        return tasks.filter(task => isTaskDueToday(task)).length;
      case 'due-tomorrow':
        return tasks.filter(task => isTaskDueTomorrow(task)).length;
      case 'due-week':
        return tasks.filter(task => isTaskDueInNext7Days(task)).length;
      default:
        return tasks.length;
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onComplete={onComplete}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <SymbolView
        name="checklist"
        style={styles.emptyStateIcon}
        tintColor="#8E8E93"
        type="hierarchical"
      />
      <Text style={styles.emptyStateText}>
        {filter === 'all'
          ? 'No tasks yet. Create your first recurring task!'
          : `No tasks ${
              filter === 'due-today'
                ? 'due today'
                : filter === 'due-tomorrow'
                  ? 'due tomorrow'
                  : 'due in the next 7 days'
            }.`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <SymbolView
            name="list.bullet"
            style={styles.filterIcon}
            tintColor={filter === 'all' ? 'white' : '#8E8E93'}
            type="monochrome"
          />
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.activeFilterText,
            ]}
          >
            All ({getFilterCount('all')})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'due-today' && styles.activeFilter,
          ]}
          onPress={() => setFilter('due-today')}
        >
          <SymbolView
            name="sun.max"
            style={styles.filterIcon}
            tintColor={filter === 'due-today' ? 'white' : '#8E8E93'}
            type="monochrome"
          />
          <Text
            style={[
              styles.filterText,
              filter === 'due-today' && styles.activeFilterText,
            ]}
          >
            Today ({getFilterCount('due-today')})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'due-tomorrow' && styles.activeFilter,
          ]}
          onPress={() => setFilter('due-tomorrow')}
        >
          <SymbolView
            name="moon"
            style={styles.filterIcon}
            tintColor={filter === 'due-tomorrow' ? 'white' : '#8E8E93'}
            type="monochrome"
          />
          <Text
            style={[
              styles.filterText,
              filter === 'due-tomorrow' && styles.activeFilterText,
            ]}
          >
            Tomorrow ({getFilterCount('due-tomorrow')})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'due-week' && styles.activeFilter,
          ]}
          onPress={() => setFilter('due-week')}
        >
          <SymbolView
            name="calendar"
            style={styles.filterIcon}
            tintColor={filter === 'due-week' ? 'white' : '#8E8E93'}
            type="monochrome"
          />
          <Text
            style={[
              styles.filterText,
              filter === 'due-week' && styles.activeFilterText,
            ]}
          >
            This Week ({getFilterCount('due-week')})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C6C6C8',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    gap: 6,
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterIcon: {
    width: 12,
    height: 12,
  },
  filterText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyStateIcon: {
    width: 48,
    height: 48,
  },
  emptyStateText: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
    maxWidth: 280,
  },
});
