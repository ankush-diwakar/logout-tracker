import React from 'react';
import { Briefcase, Coffee, Edit3 } from 'lucide-react';

interface WorkHoursSelectorProps {
  preset: string; // '8.5', '4.5', '8.0', '9.0', 'custom'
  onSelectPreset: (preset: string) => void;
  customValue: string;
  onChangeCustomValue: (val: string) => void;
  breakMinutes: number;
  onChangeBreakMinutes: (mins: number) => void;
  effectiveWorkMinutes: number;
  effectiveWorkFormatted: string;
}

const PRESETS = [
  { id: '8.5', label: '8.5h', sub: '8h 30m', shortcut: '1' },
  { id: '4.5', label: '4.5h', sub: '4h 30m', shortcut: '2' },
  { id: '8.0', label: '8.0h', sub: '8h 00m', shortcut: '3' },
  { id: '9.0', label: '9.0h', sub: '9h 00m', shortcut: '4' },
  { id: 'custom', label: 'Custom', sub: 'Flexible', shortcut: '5' },
];

const BREAK_OPTIONS = [
  { mins: 0, label: 'No Break' },
  { mins: 30, label: '+30m Break' },
  { mins: 45, label: '+45m Break' },
  { mins: 60, label: '+1h Lunch' },
];

export const WorkHoursSelector: React.FC<WorkHoursSelectorProps> = ({
  preset,
  onSelectPreset,
  customValue,
  onChangeCustomValue,
  breakMinutes,
  onChangeBreakMinutes,
  effectiveWorkFormatted,
}) => {
  return (
    <div
      className="linear-card"
      style={{
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Briefcase size={15} style={{ color: 'var(--color-brand)' }} />
          <span className="text-label" style={{ color: 'var(--color-text)', textTransform: 'uppercase' }}>
            2. Shift Duration
          </span>
        </div>

        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-brand)' }}>
          Target: {effectiveWorkFormatted}
        </span>
      </div>

      {/* Preset Buttons Grid */}
      <div className="presets-grid">
        {PRESETS.map((p) => {
          const isSelected = preset === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPreset(p.id)}
              className="linear-card"
              style={{
                padding: 'var(--space-2) var(--space-1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                minHeight: '44px',
                backgroundColor: isSelected ? 'var(--color-brand-subtle)' : 'var(--color-surface-subtle)',
                borderColor: isSelected ? 'var(--color-brand)' : 'var(--color-border)',
                borderRadius: 'var(--radius-md)',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: isSelected ? 'var(--color-brand)' : 'var(--color-text)',
                  }}
                >
                  {p.label}
                </span>
                <span className="kbd-badge" style={{ fontSize: '9px', padding: '0 3px' }}>
                  {p.shortcut}
                </span>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--color-muted)' }}>
                {p.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom Input Field if 'custom' is active */}
      {preset === 'custom' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-3)',
            backgroundColor: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-brand)',
          }}
        >
          <Edit3 size={14} style={{ color: 'var(--color-brand)' }} />
          <input
            type="text"
            value={customValue}
            onChange={(e) => onChangeCustomValue(e.target.value)}
            placeholder="Type hours (e.g. 7.5, 6:30, 8h 15m, 4.25)..."
            className="linear-input"
            style={{
              height: '32px',
              border: 'none',
              backgroundColor: 'transparent',
              padding: 0,
            }}
            autoFocus
          />
        </div>
      )}

      {/* Optional Break Time Row */}
      <div className="break-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Coffee size={13} style={{ color: 'var(--color-muted)' }} />
          <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>Lunch / Break:</span>
        </div>

        <div className="break-options-list">
          {BREAK_OPTIONS.map((opt) => {
            const isSelected = breakMinutes === opt.mins;
            return (
              <button
                key={opt.mins}
                type="button"
                onClick={() => onChangeBreakMinutes(opt.mins)}
                style={{
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: isSelected ? 'var(--color-brand)' : 'var(--color-surface-subtle)',
                  color: isSelected ? 'var(--color-brand-text)' : 'var(--color-muted)',
                  fontWeight: isSelected ? 600 : 400,
                  border: `1px solid ${isSelected ? 'var(--color-brand)' : 'var(--color-border)'}`,
                  transition: 'all var(--transition-fast)',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
