import React, { useEffect } from 'react';
import { X, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'N', description: 'Set login time to current time (Now)' },
  { key: '1', description: 'Set shift to 8.5 hours (Full day)' },
  { key: '2', description: 'Set shift to 4.5 hours (Half day)' },
  { key: '3', description: 'Set shift to 8.0 hours' },
  { key: '4', description: 'Set shift to 9.0 hours' },
  { key: '5', description: 'Focus custom hours input' },
  { key: 'C', description: 'Copy logout time to clipboard' },
  { key: 'R', description: 'Reroll random off-time emoji' },
  { key: 'M', description: 'Cycle desk mascot companion' },
  { key: 'D', description: 'Toggle Dark / Light mode' },
  { key: '?', description: 'Toggle this keyboard shortcuts menu' },
  { key: 'Esc', description: 'Close this dialog' },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 'var(--space-4)',
      }}
      onClick={onClose}
    >
      <div
        className="linear-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-modal)',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Command size={15} style={{ color: 'var(--color-brand)' }} />
            <span className="text-h2" style={{ fontSize: '15px' }}>
              Keyboard Shortcuts
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ width: '26px', height: '26px', padding: 0 }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Shortcuts List (Linear issue rows) */}
        <div style={{ padding: 'var(--space-2) var(--space-3)', maxHeight: '380px', overflowY: 'auto' }}>
          {SHORTCUTS.map((item) => (
            <div
              key={item.key}
              className="linear-row"
              style={{
                justifyContent: 'space-between',
                height: '34px',
                padding: '0 var(--space-2)',
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--color-text)' }}>
                {item.description}
              </span>
              <span className="kbd-badge" style={{ minWidth: '22px' }}>
                {item.key}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: 'var(--space-2) var(--space-4)',
            borderTop: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-surface-subtle)',
            fontSize: '11px',
            color: 'var(--color-muted)',
            textAlign: 'right',
          }}
        >
          Linear-style navigation · Press <span className="kbd-badge">Esc</span> to dismiss
        </div>
      </div>
    </div>
  );
};
