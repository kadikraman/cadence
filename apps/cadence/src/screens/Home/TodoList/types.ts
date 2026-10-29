import type { ReactNode, RefObject } from 'react';
import type { TextInputInstance } from 'react-native';
import type { Todo } from '../../../lib/types';

export interface TodoRowCallbacks {
  onToggle: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export interface TodoRowProps {
  todo: Todo;
  checked: boolean;
  last: boolean;
  callbacks: TodoRowCallbacks;
}

export interface TodoListProps {
  inputRef: RefObject<TextInputInstance | null>;
  header?: ReactNode;
}

export interface TodoUndo {
  key: number;
  message: string;
  items: Todo[];
}
