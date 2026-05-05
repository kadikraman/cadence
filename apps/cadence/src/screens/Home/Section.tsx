import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import TaskRow, { TaskRowActions } from '../../components/TaskRow';
import { Task } from '../../lib/types';

interface SectionProps {
  label: string;
  dotColor: string;
  items: Task[];
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  buildActions: (task: Task) => TaskRowActions;
}

export default function Section({
  label,
  dotColor,
  items,
  expandedId,
  onToggleExpand,
  buildActions,
}: SectionProps) {
  if (items.length === 0) return null;
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
        <Text style={styles.sectionLabel}>{label}</Text>
        <Text style={styles.sectionCount}>{items.length}</Text>
      </View>
      <View style={styles.sectionCard}>
        {items.map((task, i) => (
          <View key={task.id}>
            <TaskRow
              task={task}
              isExpanded={expandedId === task.id}
              onTap={() => onToggleExpand(task.id)}
              actions={buildActions(task)}
            />
            {i < items.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 8,
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
  sectionCard: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 16,
    overflow: 'hidden',
  },
  separator: {
    height: 0.5,
    backgroundColor: theme.colors.sepSubtle,
    marginLeft: 68,
  },
}));
