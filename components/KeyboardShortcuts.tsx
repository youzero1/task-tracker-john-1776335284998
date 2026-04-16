'use client';

import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: ['N'], description: 'Focus the new task input' },
  { keys: ['Enter'], description: 'Add a new task (when input is focused)' },
  { keys: ['E'], description: 'Edit selected / hovered task' },
  { keys: ['D'], description: 'Delete selected / hovered task' },
  { keys: ['Space'], description: 'Toggle complete on selected task' },
  { keys: ['1'], description: 'Switch filter to All' },
  { keys: ['2'], description: 'Switch filter to Active' },
  { keys: ['3'], description: 'Switch filter to Done' },
  { keys: ['C'], description: 'Clear all completed tasks' },
  { keys: ['?'], description: 'Open / close this shortcuts window' },
  { keys: ['Esc'], description: 'Close this shortcuts window' },
];

export default function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-red-950 to-red-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⌨️</span>
            <h2 className="text-white font-bold text-lg tracking-wide">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            aria-label="Close shortcuts window"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="px-6 py-4 space-y-2 max-h-[70vh] overflow-y-auto">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 py-2 border-b border-white/5 last:border-0"
            >
              <span className="text-white/70 text-sm">{shortcut.description}</span>
              <div className="flex items-center gap-1 flex-shrink-0">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 bg-white/10 border border-white/20 rounded-md text-white text-xs font-mono font-semibold shadow-md"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white/5 border-t border-white/10">
          <p className="text-white/30 text-xs text-center">
            Press <kbd className="inline-flex items-center px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-white/50 font-mono text-xs">?</kbd> anytime to toggle this window
          </p>
        </div>
      </div>
    </div>
  );
}
