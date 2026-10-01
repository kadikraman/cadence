import { useState } from 'react';
import type { Task } from '../../lib/types';
import BottomSheet from '../BottomSheet';
import SheetContent from './SheetContent';
import type { CompletionEdit } from './types';

export type { CompletionEdit } from './types';

interface CompletionSheetProps {
  visible: boolean;
  task: Task | null;
  editing?: CompletionEdit | null;
  onClose: () => void;
  onConfirm: (ts: number) => void;
}

export default function CompletionSheet({
  visible,
  task: liveTask,
  editing = null,
  onClose,
  onConfirm,
}: CompletionSheetProps) {
  const [task, setTask] = useState(liveTask);

  if (visible && liveTask !== task) setTask(liveTask);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      {task && (
        <SheetContent
          task={task}
          editing={editing}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      )}
    </BottomSheet>
  );
}
