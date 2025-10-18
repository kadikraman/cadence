import { useCallback } from 'react';
import { db, id, Task } from '../lib/db';
import { calculateNextDueDate, TaskFormData } from '../utils/taskUtils';

export const useTasks = () => {
  const user = db.useUser();
  const { data, isLoading } = db.useQuery({
    tasks: {
      $: {
        where: {
          userId: user?.id,
        },
      },
    },
  });

  const createTask = useCallback(
    async (taskData: TaskFormData) => {
      if (!user) return;

      const now = Date.now();

      await db.transact([
        db.tx.tasks[id()].create({
          name: taskData.name,
          description: taskData.description || '',
          cadenceType: taskData.cadenceType,
          cadenceInterval: taskData.cadenceInterval,
          nextDueDate: taskData.nextDueDate.getTime(),
          createdAt: now,
          updatedAt: now,
          userId: user.id,
        }),
      ]);
    },
    [user]
  );

  const completeTask = useCallback(async (task: Task) => {
    const nextDueDate = calculateNextDueDate(
      new Date(task.nextDueDate),
      task.cadenceType as any,
      task.cadenceInterval
    );

    await db.transact([
      db.tx.tasks[task.id].update({
        nextDueDate: nextDueDate.getTime(),
        updatedAt: Date.now(),
      }),
    ]);
  }, []);

  const updateTask = useCallback(
    async (taskId: string, updates: Partial<TaskFormData>) => {
      const updateData: any = {
        updatedAt: Date.now(),
      };

      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined)
        updateData.description = updates.description;
      if (updates.cadenceType !== undefined)
        updateData.cadenceType = updates.cadenceType;
      if (updates.cadenceInterval !== undefined)
        updateData.cadenceInterval = updates.cadenceInterval;
      if (updates.nextDueDate !== undefined)
        updateData.nextDueDate = updates.nextDueDate.getTime();

      await db.transact([db.tx.tasks[taskId].update(updateData)]);
    },
    []
  );

  const deleteTask = useCallback(async (taskId: string) => {
    await db.transact([db.tx.tasks[taskId].delete()]);
  }, []);

  return {
    tasks: data?.tasks || [],
    isLoading,
    createTask,
    completeTask,
    updateTask,
    deleteTask,
  };
};
