'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';
import TodoFilter from '@/components/TodoFilter';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';

export type FilterType = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTodo = (text: string) => {
    if (!text.trim()) return;
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const editTodo = (id: string, newText: string) => {
    if (!newText.trim()) return;
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: newText.trim() } : todo
      )
    );
  };

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, []);

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      const isTyping = tag === 'input' || tag === 'textarea';

      // Always available
      if (e.key === '?') {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
        return;
      }

      // Skip shortcuts when typing in an input (except Escape handled in modal)
      if (isTyping) return;

      switch (e.key) {
        case 'n':
        case 'N':
          e.preventDefault();
          inputRef.current?.focus();
          break;
        case '1':
          e.preventDefault();
          setFilter('all');
          break;
        case '2':
          e.preventDefault();
          setFilter('active');
          break;
        case '3':
          e.preventDefault();
          setFilter('completed');
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          clearCompleted();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearCompleted]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-900 via-red-700 to-rose-900 flex flex-col items-center py-16 px-4">
      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      {/* Header */}
      <div className="w-full max-w-lg mb-10">
        <h1 className="text-5xl font-bold tracking-widest text-white text-center uppercase mb-2">
          Todo
        </h1>
        <p className="text-center text-red-200 text-sm tracking-wide">
          Stay organized, stay productive
        </p>
      </div>

      {/* Input */}
      <div className="w-full max-w-lg mb-5">
        <TodoInput onAdd={addTodo} inputRef={inputRef} />
      </div>

      {/* Todo Card */}
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        {filteredTodos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/40">
            <svg
              className="w-16 h-16 mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-lg font-medium">
              {filter === 'all' ? 'No tasks yet' : filter === 'active' ? 'No active tasks' : 'No completed tasks'}
            </p>
            <p className="text-sm mt-1">
              {filter === 'all' ? 'Add a task above to get started' : 'Change filter to see other tasks'}
            </p>
          </div>
        ) : (
          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        )}

        {/* Footer */}
        {todos.length > 0 && (
          <div className="border-t border-white/10 px-5 py-3 flex items-center justify-between">
            <span className="text-white/50 text-sm">
              {activeCount} item{activeCount !== 1 ? 's' : ''} left
            </span>
            <TodoFilter filter={filter} onFilterChange={setFilter} />
            <button
              onClick={clearCompleted}
              disabled={completedCount === 0}
              className="text-sm text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Clear completed
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      {todos.length > 0 && (
        <div className="w-full max-w-lg mt-6 grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <p className="text-2xl font-bold text-white">{todos.length}</p>
            <p className="text-xs text-white/50 mt-1">Total</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <p className="text-2xl font-bold text-red-300">{activeCount}</p>
            <p className="text-xs text-white/50 mt-1">Active</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <p className="text-2xl font-bold text-rose-300">{completedCount}</p>
            <p className="text-xs text-white/50 mt-1">Done</p>
          </div>
        </div>
      )}

      {/* Shortcuts hint button */}
      <button
        onClick={() => setShortcutsOpen(true)}
        className="mt-8 flex items-center gap-2 text-white/30 hover:text-white/70 transition-colors text-xs group"
        aria-label="View keyboard shortcuts"
      >
        <kbd className="inline-flex items-center px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-white/40 group-hover:text-white/70 font-mono text-xs transition-colors">?</kbd>
        <span>keyboard shortcuts</span>
      </button>
    </main>
  );
}
