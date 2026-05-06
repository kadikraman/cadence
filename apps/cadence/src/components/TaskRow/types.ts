import type { Task } from '../../lib/types';

export interface TaskRowCallbacks {
  onTap: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  onQuickDone: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onOpenHistory: (task: Task) => void;
  onPickDate: (task: Task) => void;
}

export interface TaskRowProps {
  task: Task;
  isExpanded: boolean;
  callbacks: TaskRowCallbacks;
}
