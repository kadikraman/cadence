import { useObserve } from 'expo-observe';
import {
  Stack,
  useIsPreview,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { routes } from '../../lib/routes';
import { useTasksStore } from '../../stores/tasks';
import TaskDetailBody from './TaskDetailBody';

export default function TaskDetailScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const router = useRouter();
  const taskExists = useTasksStore(s => s.tasks.some(t => t.id === taskId));

  const isPreview = useIsPreview();
  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  return (
    <View style={styles.root}>
      {taskExists && !isPreview && (
        <>
          <Stack.Screen
            options={{
              title: '',
              headerBackTitle: 'Tasks',
              headerTransparent: true,
            }}
          />
          <Stack.Toolbar placement="right">
            <Stack.Toolbar.Button
              icon="pencil"
              onPress={() => router.push(routes.editTask(taskId))}
            >
              Edit
            </Stack.Toolbar.Button>
          </Stack.Toolbar>
        </>
      )}
      <TaskDetailBody taskId={taskId} />
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
    paddingLeft: rt.insets.left,
    paddingRight: rt.insets.right,
  },
}));
