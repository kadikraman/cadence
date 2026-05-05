import type { Task } from '../../lib/types';

export interface TaskRowActions {
  toggleComplete: () => void;
  quickDone: () => void;
  edit: () => void;
  delete: () => void;
  openHistory: () => void;
  pickDate: () => void;
}

export interface TaskRowProps {
  task: Task;
  isExpanded: boolean;
  onTap: () => void;
  actions: TaskRowActions;
}
