import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { Task } from '../../lib/types';
import TaskTile from '../ui/TaskTile';
import UiSymbol from '../ui/UiSymbol';

interface SheetHeaderProps {
  task: Task;
  overdue: boolean;
  onClose: () => void;
}

export default function SheetHeader({
  task,
  overdue,
  onClose,
}: SheetHeaderProps) {
  const { theme } = useUnistyles();
  return (
    <View style={styles.header}>
      <TaskTile task={task} size={40} overdue={overdue} />
      <View style={styles.headerText}>
        <Text style={styles.taskTitle} numberOfLines={1}>
          {task.title}
        </Text>
        <Text style={styles.question}>When did you do it?</Text>
      </View>
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close"
        style={styles.closeBtn}
      >
        <UiSymbol name="xmark" size={12} color={theme.colors.label3} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.label3,
  },
  question: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: theme.colors.text,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.fill3,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
