import React from 'react';
import { X, Sun, Moon, RefreshCw, Trash2, RotateCcw } from 'lucide-react';
import type { MascotCharacter, ThemeMode, CalculationHistoryItem } from '../types';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeCharacter: MascotCharacter;
  availableCharacters: MascotCharacter[];
  onSelectCharacter: (char: MascotCharacter) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  history: CalculationHistoryItem[];
  onSelectHistoryItem: (item: CalculationHistoryItem) => void;
  onClearHistory: () => void;
  onResetJourney: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeCharacter,
  availableCharacters,
  onSelectCharacter,
  theme,
  onToggleTheme,
  history,
  onSelectHistoryItem,
  onClearHistory,
  onResetJourney,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        className="linear-card"
        style={{
          width: '100%',
          maxHeight: '85vh',
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-modal)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="text-label" style={{ color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Extras & Settings
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ width: '32px', height: '32px', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* 1. Theme Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-2) var(--space-3)',
            backgroundColor: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
            <span style={{ fontSize: '13px', fontWeight: 500 }}>
              Theme: {theme === 'dark' ? 'Dark' : 'Light'}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className="btn-secondary"
            style={{ height: '28px', padding: '0 10px', fontSize: '12px' }}
          >
            Toggle
          </button>
        </div>

        {/* 2. Mascot Companion Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span className="text-label" style={{ color: 'var(--color-muted)' }}>
            Choose Mascot Companion
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {availableCharacters.map((char) => {
              const isSelected = char.id === activeCharacter.id;
              return (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => {
                    onSelectCharacter(char);
                  }}
                  className="linear-card"
                  style={{
                    padding: '8px 4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    backgroundColor: isSelected ? 'var(--color-brand)' : 'var(--color-surface-subtle)',
                    color: isSelected ? 'var(--color-brand-text)' : 'var(--color-text)',
                    borderColor: isSelected ? 'var(--color-brand)' : 'var(--color-border)',
                    fontWeight: isSelected ? 600 : 400,
                    fontSize: '12px',
                  }}
                >
                  <RefreshCw size={12} style={{ opacity: isSelected ? 1 : 0.6 }} />
                  <span>{char.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Reset Journey Button */}
        <button
          type="button"
          onClick={() => {
            onResetJourney();
            onClose();
          }}
          className="btn-secondary"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <RotateCcw size={14} />
          <span>Reset Journey to Step 1</span>
        </button>

        {/* 4. Recent Shift History */}
        {history.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="text-label" style={{ color: 'var(--color-muted)' }}>
                Recent Calculations
              </span>
              <button
                type="button"
                onClick={onClearHistory}
                style={{ fontSize: '11px', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}
              >
                <Trash2 size={11} />
                <span>Clear</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {history.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectHistoryItem(item);
                    onClose();
                  }}
                  className="linear-row"
                  style={{
                    justifyContent: 'space-between',
                    height: '36px',
                    padding: '0 8px',
                    backgroundColor: 'var(--color-surface-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                  }}
                >
                  <span>{item.emoji} In: {item.loginTime12}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    Out: {item.logoutTime12}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
