import { describe, expect, test } from 'bun:test';
import { Todo } from '../lib/types';
import {
  addTodo,
  clearDone,
  mergeTodos,
  removeTodo,
  splitTodos,
  toggleTodo,
} from './todoReducers';

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return { id: 'a', title: 'Buy milk', createdAt: 1000, ...overrides };
}

describe('addTodo', () => {
  test('prepends a trimmed todo', () => {
    const next = addTodo([makeTodo()], '  Call mum ', 2000);
    expect(next).toHaveLength(2);
    expect(next[0]).toEqual({
      id: 'todo_2000',
      title: 'Call mum',
      createdAt: 2000,
    });
  });

  test('ignores a blank title', () => {
    const existing = [makeTodo()];
    expect(addTodo(existing, '   ')).toBe(existing);
  });
});

describe('toggleTodo', () => {
  test('marks an open todo done', () => {
    const next = toggleTodo([makeTodo()], 'a', 5000);
    expect(next[0].completedAt).toBe(5000);
  });

  test('reopens a done todo', () => {
    const next = toggleTodo([makeTodo({ completedAt: 5000 })], 'a');
    expect('completedAt' in next[0]).toBe(false);
  });
});

describe('removeTodo and clearDone', () => {
  test('removeTodo drops by id', () => {
    expect(removeTodo([makeTodo(), makeTodo({ id: 'b' })], 'a')).toEqual([
      makeTodo({ id: 'b' }),
    ]);
  });

  test('clearDone keeps only open todos', () => {
    const todos = [makeTodo(), makeTodo({ id: 'b', completedAt: 1 })];
    expect(clearDone(todos)).toEqual([makeTodo()]);
  });
});

describe('mergeTodos', () => {
  test('adds only new ids', () => {
    const res = mergeTodos([makeTodo()], [makeTodo(), makeTodo({ id: 'b' })]);
    expect(res.merged.map(t => t.id)).toEqual(['a', 'b']);
    expect(res.imported).toBe(1);
    expect(res.skipped).toBe(1);
  });
});

describe('splitTodos', () => {
  test('orders open by newest and done by most recently done', () => {
    const todos = [
      makeTodo({ id: 'old', createdAt: 1 }),
      makeTodo({ id: 'new', createdAt: 2 }),
      makeTodo({ id: 'd1', completedAt: 10 }),
      makeTodo({ id: 'd2', completedAt: 20 }),
    ];
    const { open, done } = splitTodos(todos);
    expect(open.map(t => t.id)).toEqual(['new', 'old']);
    expect(done.map(t => t.id)).toEqual(['d2', 'd1']);
  });
});
