import React from 'react';
import { Sun, Moon, Keyboard, Clock } from 'lucide-react';
import type { ThemeMode, MascotCharacter } from '../types';

interface LinearNavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  activeCharacter: MascotCharacter;
  availableCharacters: MascotCharacter[];
  onSelectCharacter: (char: MascotCharacter) => void;
  onOpenShortcuts: () => void;
  currentTimeString: string;
}

export const LinearNavbar: React.FC<LinearNavbarProps> = ({
  theme,
  onToggleTheme,
  activeCharacter,
  availableCharacters,
  onSelectCharacter,
  onOpenShortcuts,
  currentTimeString,
}) => {
  return (
    <header
      style={{
        height: '48px',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-4)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left: Brand & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            color: 'var(--color-brand)',
            fontWeight: 600,
            fontSize: '14px',
            letterSpacing: '0.04em',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-brand-subtle)',
              border: '1px solid var(--color-brand-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-brand)',
            }}
          >
            <Clock size={14} strokeWidth={2.5} />
          </div>
          <span style={{ color: 'var(--color-text)' }}>OFF-LOGOUT</span>
        </div>

        <div
          style={{
            height: '14px',
            width: '1px',
            backgroundColor: 'var(--color-border)',
          }}
        />

        <div
          className="header-clock-pill"
          style={{
            alignItems: 'center',
            gap: 'var(--space-1)',
            padding: '2px 8px',
            backgroundColor: 'var(--color-surface-subtle)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            color: 'var(--color-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-brand)',
              display: 'inline-block',
            }}
          />
          <span>NOW {currentTimeString}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {/* Companion Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          <span className="header-mascot-label" style={{ fontSize: '11px', color: 'var(--color-muted)', marginRight: '2px' }}>
            Mascot:
          </span>
          <div
            style={{
              display: 'inline-flex',
              padding: '2px',
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              gap: '2px',
            }}
          >
            {availableCharacters.map((char) => {
              const isSelected = char.id === activeCharacter.id;
              return (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => onSelectCharacter(char)}
                  title={`Switch companion to ${char.name} [M]`}
                  style={{
                    padding: '2px 6px',
                    fontSize: '11px',
                    fontWeight: isSelected ? 600 : 400,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected ? 'var(--color-brand)' : 'transparent',
                    color: isSelected ? 'var(--color-brand-text)' : 'var(--color-muted)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {char.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Shortcuts Button */}
        <button
          type="button"
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts [?]"
          className="linear-row header-shortcuts-btn"
          style={{
            height: '28px',
            padding: '0 8px',
            gap: 'var(--space-1)',
            backgroundColor: 'var(--color-surface-subtle)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-muted)',
            fontSize: '12px',
          }}
        >
          <Keyboard size={13} />
          <span className="kbd-badge">?</span>
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode [D]`}
          className="linear-row"
          style={{
            height: '28px',
            padding: '0 8px',
            gap: 'var(--space-2)',
            backgroundColor: 'var(--color-surface-subtle)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text)',
            fontSize: '12px',
          }}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={13} style={{ color: 'var(--color-text)' }} />
              <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>Light</span>
            </>
          ) : (
            <>
              <Moon size={13} style={{ color: 'var(--color-text)' }} />
              <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>Dark</span>
            </>
          )}
          <span className="kbd-badge">D</span>
        </button>
      </div>
    </header>
  );
};
