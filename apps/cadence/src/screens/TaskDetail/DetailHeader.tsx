import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import TaskTile from '../../components/ui/TaskTile';
import UiSymbol from '../../components/ui/UiSymbol';
import { Task } from '../../lib/types';
import { formatCadence } from '../../utils/taskUtils';

export default function DetailHeader({ task }: { task: Task }) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <TaskTile task={task} size={44} />
        <View style={styles.text}>
          <Text style={styles.title}>{task.title}</Text>
          <View style={styles.cadenceRow}>
            <UiSymbol
              name="arrow.triangle.2.circlepath"
              size={13}
              color={theme.colors.label3}
            />
            <Text style={styles.cadence}>{formatCadence(task.cadence)}</Text>
          </View>
        </View>
      </View>
      {task.details ? <Text style={styles.details}>{task.details}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 30,
    color: theme.colors.text,
  },
  cadenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  cadence: {
    fontSize: 15,
    color: theme.colors.label3,
  },
  details: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 19,
    color: theme.colors.label2,
  },
}));
